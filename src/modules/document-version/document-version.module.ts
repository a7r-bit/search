import { Module } from '@nestjs/common';
import { BullmqModule } from '../bullmq';
import { FileStorageModule } from '../file-storage';
import { DocumentVersionController } from './document-version.controller';
import { DocumentVersionService } from './document-version.service';

@Module({
    imports: [BullmqModule, FileStorageModule],
    controllers: [DocumentVersionController],
    providers: [DocumentVersionService],

    exports: [DocumentVersionService],
})
export class DocumentVersionModule {}
