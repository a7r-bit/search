import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateDocumentVersionDto } from './dto/create-document-version.dto';
import { UpdateDocumentVersionDto } from './dto/update-document-version.dto';
import { PrismaService } from '../prisma/prisma.service';
import { DocumentConversionService } from '../bullmq/document-conversion.service';
import { FileStorageService } from '../file-storage/file-storage.service';
import path from 'path';
import { DocumentVersionDto } from './dto/document-version.dto';
import { DocumentVersionFilterDto } from './dto/document_version_filter_dto ';
import { SearchService } from '../search';
import { Prisma } from '@prisma/client';
import { ElasticTypes } from '../../common/constants';
import { SortingParam } from '../../common/decorators/sorting-params.decorator';

@Injectable()
export class DocumentVersionService {
    private logger = new Logger(DocumentVersionService.name);
    constructor(
        private readonly prisma: PrismaService,
        private readonly fileStorageService: FileStorageService,
        private readonly documentConversionService: DocumentConversionService,
        private readonly searchService: SearchService,
    ) {}
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

    async findAll(): Promise<DocumentVersionDto[]> {
        const documents = await this.prisma.documentVersion.findMany({
            orderBy: { nodeId: 'desc' },
            include: { mediaFile: true },
        });
        return documents.map((el) => new DocumentVersionDto(el));
    }

    async findOneById(id: string): Promise<DocumentVersionDto> {
        const foundVersion = await this.prisma.documentVersion.findUnique({
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

        const ext = path.extname(file.originalname).toLocaleLowerCase();

        const isPDF = ext == '.pdf';
        const savedDir = isPDF ? './uploads/converted' : './uploads/original';

        const savedFilePath = await this.fileStorageService.saveFileToDisk(file, savedDir);

        const documentVersion = await this.prisma.$transaction(async (tx) => {
            const lastVersion = await this.getLastVersion(nodeId, tx);
            const newVersion = await tx.documentVersion.create({
                data: { nodeId, version: lastVersion + 1, conversionStatus: 'PENDING' },
            });
            await tx.mediaFile.create({
                data: {
                    filePath: savedFilePath,
                    fileName: path.basename(
                        await this.fileStorageService.convertOriginalName(file.originalname),
                        path.extname(file.originalname),
                    ),
                    extention: path.extname(file.originalname),
                    documentVersionId: newVersion.id,
                },
            });

            return await tx.documentVersion.findUniqueOrThrow({
                where: { id: newVersion.id },
                include: { mediaFile: true },
            });
        });
        await this.documentConversionService.addConversionJob(documentVersion.id, savedFilePath, isPDF);

        return new DocumentVersionDto(documentVersion);
    }

    async createFromPath(createDocumentVersionDto: CreateDocumentVersionDto, filePath: string): Promise<DocumentVersionDto> {
        const { nodeId } = createDocumentVersionDto;
        const node = await this.prisma.node.findUnique({
            where: { id: nodeId, type: 'DOCUMENT' },
        });
        if (!node) {
            throw new NotFoundException('Родительский докумет не найден');
        }

        const ext = path.extname(filePath).toLocaleLowerCase();

        const isPDF = ext == '.pdf';
        // const savedDir = isPDF ? "./uploads/converted" : "./uploads/original";

        // const savedFilePath = await this.fileStorageService.saveFileToDisk(file, savedDir)

        const documentVersion = await this.prisma.$transaction(async (tx) => {
            const lastVersion = await this.getLastVersion(nodeId, tx);

            const newVersion = await tx.documentVersion.create({
                data: { nodeId, version: lastVersion + 1, conversionStatus: 'PENDING' },
            });

            await tx.mediaFile.create({
                data: {
                    filePath: filePath,
                    fileName: path.basename(filePath, ext),
                    extention: ext,
                    documentVersionId: newVersion.id,
                },
            });

            return await tx.documentVersion.findUniqueOrThrow({
                where: { id: newVersion.id },
                include: { mediaFile: true },
            });
        });
        await this.documentConversionService.addConversionJob(documentVersion.id, filePath, isPDF);

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
        await this.searchService.updateDocument(ElasticTypes.DocumentVersion, updatedDocumentVersion.id, {
            nodeId: updatedDocumentVersion.nodeId,
            fileName: updatedDocumentVersion.mediaFile?.fileName,
            path: '/' + updatedDocumentVersion.mediaFile?.filePath.replace(/\\/g, '/'),
            version: updatedDocumentVersion.version,
        });

        return new DocumentVersionDto(updatedDocumentVersion);
    }

    async remove(id: string): Promise<DocumentVersionDto> {
        await this.findOneById(id);
        const deletedDocument = await this.prisma.documentVersion.delete({
            where: { id },
            include: { mediaFile: true },
        });
        if (deletedDocument.mediaFile) {
            await this.fileStorageService.deleteFileFromDisk(deletedDocument.mediaFile.filePath);
        }
        await this.searchService.deleteDocument(ElasticTypes.DocumentVersion, deletedDocument.id);

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
                await this.fileStorageService.deleteFileFromDisk(doc.mediaFile.filePath);
            }
            try {
                await this.searchService.deleteDocument(ElasticTypes.DocumentVersion, doc.id);
            } catch (e) {
                this.logger.error('Error deleting document from elastic', e);
            }
        }

        return deletedDocuments.map((el) => new DocumentVersionDto(el));
    }
}
