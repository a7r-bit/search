import { BadRequestException, Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateDocumentVersionDto } from '../presentation/dto/create-document-version.dto';
import { UpdateDocumentVersionDto } from '../presentation/dto/update-document-version.dto';
import { PrismaService } from '../../../shared/infrastructure/prisma/prisma.service';
import { DocumentConversionService } from '../../../shared/infrastructure/bullmq/queues/document-conversion/document-conversion.service';
import path from 'path';
import { DocumentVersionDto } from '../presentation/dto/document-version.dto';
import { DocumentVersionFilterDto } from '../presentation/dto/document_version_filter_dto ';
import { Node, Prisma } from '@prisma/client';
import { SortingParam } from '../../../shared/presentation/decorators/sorting-params.decorator';
import { S3Service } from '../../../shared/infrastructure/s3/s3.service';
import { INDEX_WRITER, IndexWriter } from '../../search/domain/index-writer.interface';
import { SearchIndexPayload } from '../../search/domain/search-payload.interface';
import { Kind } from '../../search/presentation/dto/search.types';

@Injectable()
export class DocumentVersionService {
    private readonly logger = new Logger(DocumentVersionService.name);

    constructor(
        private readonly prisma: PrismaService,
        private readonly documentConversionService: DocumentConversionService,
        private readonly s3Service: S3Service,
        @Inject(INDEX_WRITER) private readonly indexWriter: IndexWriter,
    ) {}

    private normalizeUploadedFileName(fileName: string): string {
        const decoded = Buffer.from(fileName, 'latin1').toString('utf8');
        const hasMojibake = /[ÐÑ]/.test(fileName);
        return hasMojibake ? decoded : fileName;
    }

    private buildIndexPayload(node: Node, fileName: string, content?: string): SearchIndexPayload {
        return {
            externalId: node.id,
            kind: Kind.DOCUMENT,
            title: fileName,
            ...(content ? { content } : {}),
            ...(node.parentId ? { parentId: node.parentId } : {}),
            createdAt: node.createdAt.toISOString(),
        };
    }

    private async indexDocumentNode(node: Node, fileName: string): Promise<void> {
        try {
            await this.indexWriter.index(this.buildIndexPayload(node, fileName));
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            this.logger.warn(`Не удалось заиндексировать документ ${node.id}: ${message}`);
        }
    }

    private async updateDocumentNodeIndex(node: Node, fileName: string): Promise<void> {
        try {
            await this.indexWriter.update(this.buildIndexPayload(node, fileName));
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            this.logger.warn(`Не удалось обновить индекс документа ${node.id}: ${message}`);
        }
    }

    private async removeDocumentNodeFromIndex(nodeId: string): Promise<void> {
        try {
            await this.indexWriter.delete({ externalId: nodeId, kind: Kind.DOCUMENT });
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            this.logger.warn(`Не удалось удалить документ ${nodeId} из индекса: ${message}`);
        }
    }

    private async getLastVersion(nodeId: string, tx: Prisma.TransactionClient): Promise<number> {
        const lastVersion = await tx.documentVersion.findFirst({
            where: { nodeId },
            orderBy: { version: 'desc' },
        });
        return lastVersion?.version ?? 0;
    }

    private async isUnique(nodeId: string, versionForCheck: number): Promise<boolean> {
        const isUnique = await this.prisma.documentVersion.findUnique({
            where: {
                version_nodeId: {
                    version: versionForCheck,
                    nodeId,
                },
            },
        });
        return isUnique ? false : true;
    }

    async findAll(filterDto?: DocumentVersionFilterDto): Promise<DocumentVersionDto[]> {
        const { fileName, conversionStatus } = filterDto || {};
        const documents = await this.prisma.documentVersion.findMany({
            where: {
                ...(conversionStatus && { conversionStatus }),
                ...(fileName && {
                    mediaFile: { fileName: { contains: fileName, mode: 'insensitive' } },
                }),
            },
            orderBy: { nodeId: 'desc' },
            include: { mediaFile: true },
        });

        return documents.map((el) => new DocumentVersionDto(el));
    }

    async findOneById(id: string): Promise<DocumentVersionDto> {
        const foundVersion = await this.prisma.documentVersion.findFirst({
            where: { id },
            include: { mediaFile: true },
        });

        if (!foundVersion) {
            throw new NotFoundException('Документ с id: ' + id + ' не найден');
        }

        return new DocumentVersionDto(foundVersion);
    }

    async findByNodeId(nodeId: string, filterDto?: DocumentVersionFilterDto, sort?: SortingParam): Promise<DocumentVersionDto[]> {
        const { fileName, conversionStatus } = filterDto || {};

        const where: Prisma.DocumentVersionWhereInput = {
            nodeId,
            ...(conversionStatus && { conversionStatus }),
            ...(fileName && {
                mediaFile: { fileName: { contains: fileName, mode: 'insensitive' } },
            }),
        };

        const orderBy: Prisma.DocumentVersionOrderByWithRelationInput[] = [];

        if (sort) {
            if (sort.property === 'fileName') {
                orderBy.push({
                    mediaFile: { fileName: sort.direction as Prisma.SortOrder },
                });
            } else {
                orderBy.push({ [sort.property]: sort.direction });
            }
        } else {
            orderBy.push({ version: 'asc' });
        }

        const documents = await this.prisma.documentVersion.findMany({
            where: where,
            orderBy: orderBy,
            include: { mediaFile: true },
        });

        return documents.map((el) => new DocumentVersionDto(el));
    }

    async create(createDocumentVersionDto: CreateDocumentVersionDto, file: Express.Multer.File): Promise<DocumentVersionDto> {
        const { nodeId } = createDocumentVersionDto;
        const node = await this.prisma.node.findUnique({
            where: { id: nodeId, type: 'DOCUMENT' },
        });
        if (!node) {
            throw new NotFoundException('Родительский докумет не найден');
        }
        const normalizedFileName = this.normalizeUploadedFileName(file.originalname);
        const ext = path.extname(normalizedFileName).toLocaleLowerCase();

        const isPDF = ext == '.pdf';
        // const savedDir = isPDF ? './uploads/converted' : './uploads/original';

        // const savedFilePath = await this.fileStorageService.saveFileToDisk(file, savedDir);
        const { key } = await this.s3Service.uploadFile(file, 'original');
        const documentVersion = await this.prisma.$transaction(async (tx) => {
            const lastVersion = await this.getLastVersion(nodeId, tx);
            const newVersion = await tx.documentVersion.create({
                data: {
                    nodeId,
                    version: lastVersion + 1,
                    conversionStatus: 'PENDING',
                    mediaFile: {
                        create: {
                            filePath: key,
                            fileName: path.basename(normalizedFileName),
                            extention: ext,
                        },
                    },
                },
            });

            return await tx.documentVersion.findUniqueOrThrow({
                where: { id: newVersion.id },
                include: { mediaFile: true },
            });
        });
        await this.documentConversionService.addConversionJob({ documentVersionId: documentVersion.id, key: key, isPDF });
        await this.indexDocumentNode(node, path.basename(normalizedFileName));

        return new DocumentVersionDto(documentVersion);
    }

    async update(id: string, updateDocumentVersionDto: UpdateDocumentVersionDto): Promise<DocumentVersionDto> {
        const { version, fileName } = updateDocumentVersionDto;

        const documentVersion = await this.findOneById(id);

        if (!documentVersion.mediaFile?.id) {
            throw new NotFoundException('Файл документа не найден');
        }

        const mediaFile = await this.prisma.mediaFile.findUnique({
            where: { id: documentVersion.mediaFile.id },
        });

        if (!mediaFile) {
            throw new NotFoundException('Файл документа не найден');
        }

        const isVersionChanged = version !== documentVersion.version;
        const isFileNameChanged = fileName !== mediaFile.fileName;

        if (isVersionChanged) {
            const isUnique = await this.isUnique(documentVersion.nodeId, version);
            if (!isUnique) {
                throw new BadRequestException(`Документ с версией ${version} уже существует`);
            }
        }

        const updatedDocumentVersion = await this.prisma.documentVersion.update({
            where: { id },
            data: {
                version: isVersionChanged ? version : documentVersion.version,
                mediaFile: {
                    update: {
                        fileName: isFileNameChanged ? fileName : mediaFile.fileName,
                    },
                },
            },
            include: {
                mediaFile: true,
            },
        });

        if (isFileNameChanged) {
            const node = await this.prisma.node.findUnique({ where: { id: documentVersion.nodeId } });
            if (node) {
                await this.updateDocumentNodeIndex(node, fileName);
            }
        }

        return new DocumentVersionDto(updatedDocumentVersion);
    }

    async remove(id: string): Promise<DocumentVersionDto> {
        await this.findOneById(id);
        const deletedDocument = await this.prisma.documentVersion.delete({
            where: { id },
            include: { mediaFile: true },
        });
        if (deletedDocument.mediaFile) {
            await this.s3Service.deleteFile(deletedDocument.mediaFile.filePath);
        }
        await this.removeDocumentNodeFromIndex(deletedDocument.nodeId);
        return new DocumentVersionDto(deletedDocument);
    }

    async removeByNodeId(nodeId: string): Promise<DocumentVersionDto[]> {
        //TODO Перевести удаление файлов на BullMq
        const node = await this.prisma.node.findUnique({ where: { id: nodeId } });
        if (!node) {
            throw new NotFoundException('Документ не найден');
        }
        const deletedDocuments = await this.prisma.documentVersion.findMany({
            where: { nodeId: node.id },
            include: { mediaFile: true },
        });
        await this.prisma.documentVersion.deleteMany({
            where: { id: { in: deletedDocuments.map((doc) => doc.id) } },
        });
        for (const doc of deletedDocuments) {
            if (doc.mediaFile) {
                await this.s3Service.deleteFile(doc.mediaFile.filePath);
            }
        }
        await this.removeDocumentNodeFromIndex(node.id);

        return deletedDocuments.map((el) => new DocumentVersionDto(el));
    }
}
