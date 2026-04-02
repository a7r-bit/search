import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { PrismaService } from '../../../prisma/prisma.service';
import { GotenbergService } from '../../../gotenberg/gotenberg.service';
import { FileStorageService } from '../../../file-storage/file-storage.service';
import { PdfService } from '../../../pdf/pdf.service';
import { SearchService } from '../../../search';
import { instanceToPlain } from 'class-transformer';
import * as fs from 'node:fs/promises';
import { ElasticTypes } from '../../../../common/constants';
import { DocumentVersionIndexDto } from '../../../../common/elasic-search-models';

@Processor('documentConversion')
export class DocumentConversionProcessor extends WorkerHost {
    constructor(
        private readonly prisma: PrismaService,
        private readonly gotenbergService: GotenbergService,
        private readonly fileStorageService: FileStorageService,
        private readonly pdfService: PdfService,
        private readonly searchService: SearchService,
    ) {
        super();
    }
    private readonly logger = new Logger(DocumentConversionProcessor.name);

    async process(job: Job<{ documentVersionId: string; filePath: string; isPDF: boolean }>) {
        const { documentVersionId, filePath, isPDF } = job.data;
        const mediaFile = await this.prisma.mediaFile.findUniqueOrThrow({
            where: { documentVersionId },
        });

        await this.prisma.documentVersion.update({
            where: { id: documentVersionId },
            data: { conversionStatus: 'IN_PROGRESS' },
        });

        const pdfBuffer: Buffer = isPDF ? await fs.readFile(filePath) : await this.gotenbergService.convertDocxToPdf(filePath);
        const outputFilePath = await this.fileStorageService.saveGeneratedFile(pdfBuffer, mediaFile.filePath);
        const text = await this.pdfService.extractTextFromPdfByBuffer(pdfBuffer);

        await this.prisma.mediaFile.update({
            where: { id: mediaFile.id },
            data: {
                filePath: outputFilePath,
                extention: 'pdf',
            },
        });
        const documentVersion = await this.prisma.documentVersion.update({
            where: { id: documentVersionId },
            include: { mediaFile: true },
            data: { conversionStatus: 'DONE' },
        });
        await this.searchService.indexDocument(
            ElasticTypes.DocumentVersion,
            documentVersionId,
            instanceToPlain(
                new DocumentVersionIndexDto(
                    text,
                    documentVersion.createdAt,
                    documentVersion.nodeId,
                    documentVersion.mediaFile.fileName,
                    documentVersion.mediaFile.filePath,
                    documentVersion.version,
                ),
            ),
        );

        this.logger.log(`🧧Файл для конвертации на пути ${mediaFile.filePath}`);

        this.logger.log(`🤞 Документ версии ${documentVersionId} успешно конвертирован`);
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
