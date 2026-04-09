import { Module } from '@nestjs/common';
import { BullmqModule } from '../bullmq';
import { FileStorageModule } from '../file-storage';
import { DocumentVersionController } from './document-version.controller';
import { DocumentVersionService } from './document-version.service';
import { S3Module } from '../../infrastructure/s3';

@Module({
    imports: [BullmqModule, FileStorageModule, S3Module],
    controllers: [DocumentVersionController],
    providers: [DocumentVersionService],

    exports: [DocumentVersionService],
})
export class DocumentVersionModule {}
