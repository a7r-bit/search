import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Inject, Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { PrismaService } from '../../../prisma/prisma.service';
import { GotenbergService } from '../../../../../modules/gotenberg/application/gotenberg.service';
import { PdfService } from '../../../../../modules/pdf/application/pdf.service';
import { DocumentConversionJobDto } from './dto/document-conversion-job.dto';
import { S3Service } from '../../../s3/s3.service';
import path from 'path';
import { LoggerKey } from '../../../logger/domain/logger';
import { INDEX_WRITER, IndexWriter } from '../../../../../modules/search/domain/index-writer.interface';
import { Kind } from '../../../../../modules/search/presentation/dto/search.types';

@Processor('documentConversion')
export class DocumentConversionProcessor extends WorkerHost {
    constructor(
        @Inject(LoggerKey) private logger: Logger,
        private readonly prisma: PrismaService,
        private readonly gotenbergService: GotenbergService,
        private readonly pdfService: PdfService,
        private readonly s3Service: S3Service,
        @Inject(INDEX_WRITER) private readonly indexWriter: IndexWriter,
    ) {
        super();
    }

    async process(job: Job<DocumentConversionJobDto>) {
        const { documentVersionId, key, isPDF } = job.data;
        const mediaFile = await this.prisma.mediaFile.findUniqueOrThrow({
            where: { documentVersionId },
        });

        await this.prisma.documentVersion.update({
            where: { id: documentVersionId },
            data: { conversionStatus: 'IN_PROGRESS' },
        });

        const fileBuffer = await this.s3Service.getFileBuffer(key);

        const fileName = path.basename(key);
        const pdfBuffer: Buffer = isPDF ? fileBuffer : await this.gotenbergService.convertDocxToPdf(fileBuffer, fileName);
        const { key: outputKey } = await this.s3Service.uploadBufferAsPdf(pdfBuffer, 'converted');

        await this.prisma.mediaFile.update({
            where: { id: mediaFile.id },
            data: {
                filePath: outputKey,
                extention: 'pdf',
            },
        });
        await this.prisma.documentVersion.update({
            where: { id: documentVersionId },
            data: { conversionStatus: 'DONE' },
        });

        this.logger.log(`🧧Файл для конвертации на пути ${mediaFile.filePath}`);

        this.logger.log(`🤞 Документ версии ${documentVersionId} успешно конвертирован`);

        await this.indexConvertedDocument(documentVersionId, pdfBuffer);
    }

    private async indexConvertedDocument(documentVersionId: string, pdfBuffer: Buffer): Promise<void> {
        try {
            const documentVersion = await this.prisma.documentVersion.findUnique({
                where: { id: documentVersionId },
                include: { node: true, mediaFile: true },
            });
            if (!documentVersion?.node) {
                return;
            }
            const node = documentVersion.node;

            let content: string | undefined;
            try {
                content = await this.pdfService.extractTextFromPdfByBuffer(pdfBuffer);
            } catch (error) {
                const message = error instanceof Error ? error.message : String(error);
                this.logger.warn(`Не удалось извлечь текст из PDF версии ${documentVersionId}: ${message}`);
            }

            await this.indexWriter.update({
                externalId: node.id,
                kind: Kind.DOCUMENT,
                title: documentVersion.mediaFile?.fileName ?? node.name,
                ...(content ? { content } : {}),
                ...(node.parentId ? { parentId: node.parentId } : {}),
                createdAt: node.createdAt.toISOString(),
            });
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            this.logger.warn(`Не удалось обновить индекс после конвертации ${documentVersionId}: ${message}`);
        }
    }

    @OnWorkerEvent('completed')
    onCompleted(job: Job) {
        this.logger.log(`✔ Job ${job.data.documentVersionId} выполнена`);
    }

    @OnWorkerEvent('failed')
    async onFailed(job: Job, err: Error) {
        this.logger.error(`🧨 Job ${job.data.documentVersionId} завершилась ошибкой`, err.stack || err.message);

        await this.prisma.documentVersion.update({
            where: { id: job.data.documentVersionId },
            data: { conversionStatus: 'FAILED' },
        });
    }
}
