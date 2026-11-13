import { Module } from '@nestjs/common';
import { BullmqModule } from '../../shared/infrastructure/bullmq/bullmq.module';
import { DocumentVersionController } from './presentation/document-version.controller';
import { DocumentVersionService } from './application/document-version.service';
import { S3Module } from '../../shared/infrastructure/s3/s3.module';
import { SearchModule } from '../search/search.module';

@Module({
    imports: [BullmqModule, S3Module, SearchModule],
    controllers: [DocumentVersionController],
    providers: [DocumentVersionService],

    exports: [DocumentVersionService],
})
export class DocumentVersionModule {}
