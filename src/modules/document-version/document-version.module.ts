import { Module } from '@nestjs/common';
import { BullmqModule } from '../../shared/infrastructure/bullmq/bullmq.module';
import { DocumentConversionService } from '../../shared/infrastructure/bullmq/queues/document-conversion/document-conversion.service';
import { DocumentVersionController } from './presentation/document-version.controller';
import { DocumentVersionService } from './application/document-version.service';
import { DocumentVersionRepository } from './domain/document-version.repository';
import { S3Module } from '../../shared/infrastructure/s3/s3.module';
import { SearchModule } from '../search/search.module';
import { CONVERSION_QUEUE } from '../../shared/domain/interfaces/conversion-queue.interface';

@Module({
    imports: [BullmqModule, S3Module, SearchModule],
    controllers: [DocumentVersionController],
    providers: [
        DocumentVersionService,
        DocumentVersionRepository,
        { provide: CONVERSION_QUEUE, useExisting: DocumentConversionService },
    ],

    exports: [DocumentVersionService],
})
export class DocumentVersionModule {}
