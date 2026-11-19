import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateDocumentVersionDto } from '../presentation/dto/create-document-version.dto';
import { UpdateDocumentVersionDto } from '../presentation/dto/update-document-version.dto';
import path from 'path';
import { DocumentVersionDto } from '../presentation/dto/document-version.dto';
import { DocumentVersionFilterDto } from '../presentation/dto/document_version_filter_dto ';
import { Node, NodeType } from '@prisma/client';
import { SortingParam } from '../../../shared/presentation/decorators/sorting-params.decorator';
import { FILE_STORAGE, FileStorage } from '../../../shared/domain/interfaces/file-storage.interface';
import { CONVERSION_QUEUE, ConversionQueue } from '../../../shared/domain/interfaces/conversion-queue.interface';
import { INDEX_WRITER, IndexWriter } from '../../search/domain/index-writer.interface';
import { SearchIndexPayload } from '../../search/domain/search-payload.interface';
import { Kind } from '../../search/presentation/dto/search.types';
import { DocumentVersionRepository } from '../domain/document-version.repository';
import Logger, { LOGGER_KEY } from '../../../shared/infrastructure/logger/domain/logger';

@Injectable()
export class DocumentVersionService {
    constructor(
        private readonly documentVersionRepository: DocumentVersionRepository,
        @Inject(CONVERSION_QUEUE) private readonly conversionQueue: ConversionQueue,
        @Inject(LOGGER_KEY) private readonly logger: Logger,
        @Inject(FILE_STORAGE) private readonly fileStorage: FileStorage,
        @Inject(INDEX_WRITER) private readonly indexWriter: IndexWriter,
    ) {}

    private normalizeUploadedFileName(fileName: string): string {
        const decoded = Buffer.from(fileName, 'latin1').toString('utf8');
        const hasMojibake = /[ÐÑ]/.test(fileName);
        return hasMojibake ? decoded : fileName;
    }

    // Индексация по версиям: каждая версия — отдельная запись (externalId = version.id),
    // новые версии не перезаписывают старые
    private buildIndexPayload(documentVersionId: string, node: Node, fileName: string, content?: string): SearchIndexPayload {
        return {
            externalId: documentVersionId,
            kind: Kind.DOCUMENT,
            title: fileName,
            ...(content ? { content } : {}),
            ...(node.parentId ? { parentId: node.parentId } : {}),
            createdAt: node.createdAt.toISOString(),
        };
    }

    private async indexDocumentVersion(documentVersionId: string, node: Node, fileName: string): Promise<void> {
        try {
            await this.indexWriter.index(this.buildIndexPayload(documentVersionId, node, fileName));
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            this.logger.warn(`Не удалось заиндексировать версию ${documentVersionId}: ${message}`);
        }
    }

    private async updateDocumentVersionIndex(documentVersionId: string, node: Node, fileName: string): Promise<void> {
        try {
            await this.indexWriter.update(this.buildIndexPayload(documentVersionId, node, fileName));
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            this.logger.warn(`Не удалось обновить индекс версии ${documentVersionId}: ${message}`);
        }
    }

    private async removeDocumentVersionFromIndex(documentVersionId: string): Promise<void> {
        try {
            await this.indexWriter.delete({ externalId: documentVersionId, kind: Kind.DOCUMENT });
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            this.logger.warn(`Не удалось удалить версию ${documentVersionId} из индекса: ${message}`);
        }
    }

    async findAll(filterDto?: DocumentVersionFilterDto): Promise<DocumentVersionDto[]> {
        const { fileName, conversionStatus } = filterDto || {};
        const documents = await this.documentVersionRepository.findMany({ fileName, conversionStatus });

        return documents.map((el) => new DocumentVersionDto(el));
    }

    async findOneById(id: string): Promise<DocumentVersionDto> {
        const foundVersion = await this.documentVersionRepository.findById(id);

        if (!foundVersion) {
            throw new NotFoundException('Документ с id: ' + id + ' не найден');
        }

        return new DocumentVersionDto(foundVersion);
    }

    async findByNodeId(nodeId: string, filterDto?: DocumentVersionFilterDto, sort?: SortingParam): Promise<DocumentVersionDto[]> {
        const { fileName, conversionStatus } = filterDto || {};

        const documents = await this.documentVersionRepository.findByNodeId(nodeId, { fileName, conversionStatus }, sort);

        return documents.map((el) => new DocumentVersionDto(el));
    }

    async create(createDocumentVersionDto: CreateDocumentVersionDto, file: Express.Multer.File): Promise<DocumentVersionDto> {
        const { nodeId } = createDocumentVersionDto;
        const node = await this.documentVersionRepository.findNodeById(nodeId);
        if (!node || node.type !== NodeType.DOCUMENT) {
            throw new NotFoundException('Родительский докумет не найден');
        }
        const normalizedFileName = this.normalizeUploadedFileName(file.originalname);
        const ext = path.extname(normalizedFileName).toLocaleLowerCase();

        const isPDF = ext == '.pdf';
        const { key } = await this.fileStorage.uploadFile(file, 'original');
        const documentVersion = await this.documentVersionRepository.createVersion(nodeId, {
            filePath: key,
            fileName: path.basename(normalizedFileName),
            extention: ext,
        });

        await this.conversionQueue.addConversionJob({ documentVersionId: documentVersion.id, key: key, isPDF });
        await this.indexDocumentVersion(documentVersion.id, node, path.basename(normalizedFileName));

        return new DocumentVersionDto(documentVersion);
    }

    async update(id: string, updateDocumentVersionDto: UpdateDocumentVersionDto): Promise<DocumentVersionDto> {
        const { version, fileName } = updateDocumentVersionDto;

        const documentVersion = await this.findOneById(id);

        if (!documentVersion.mediaFile?.id) {
            throw new NotFoundException('Файл документа не найден');
        }

        const isVersionChanged = version !== documentVersion.version;
        const isFileNameChanged = fileName !== documentVersion.mediaFile.fileName;

        if (isVersionChanged) {
            const isUnique = await this.documentVersionRepository.isVersionUnique(documentVersion.nodeId, version);
            if (!isUnique) {
                throw new BadRequestException(`Документ с версией ${version} уже существует`);
            }
        }

        const updatedDocumentVersion = await this.documentVersionRepository.updateVersion(id, {
            version: isVersionChanged ? version : documentVersion.version,
            fileName: isFileNameChanged ? fileName : documentVersion.mediaFile.fileName,
        });

        if (isFileNameChanged) {
            const node = await this.documentVersionRepository.findNodeById(documentVersion.nodeId);
            if (node) {
                await this.updateDocumentVersionIndex(id, node, fileName);
            }
        }

        return new DocumentVersionDto(updatedDocumentVersion);
    }

    async remove(id: string): Promise<DocumentVersionDto> {
        await this.findOneById(id);
        const deletedDocument = await this.documentVersionRepository.removeById(id);
        if (deletedDocument.mediaFile) {
            await this.fileStorage.deleteFile(deletedDocument.mediaFile.filePath);
        }
        await this.removeDocumentVersionFromIndex(deletedDocument.id);
        return new DocumentVersionDto(deletedDocument);
    }

    async removeByNodeId(nodeId: string): Promise<DocumentVersionDto[]> {
        //TODO Перевести удаление файлов на BullMq
        const node = await this.documentVersionRepository.findNodeById(nodeId);
        if (!node) {
            throw new NotFoundException('Документ не найден');
        }
        const deletedDocuments = await this.documentVersionRepository.removeByNodeId(node.id);

        for (const doc of deletedDocuments) {
            if (doc.mediaFile) {
                await this.fileStorage.deleteFile(doc.mediaFile.filePath);
            }
            await this.removeDocumentVersionFromIndex(doc.id);
        }

        return deletedDocuments.map((el) => new DocumentVersionDto(el));
    }
}
