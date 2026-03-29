import { Module } from '@nestjs/common';
import { BullmqModule } from '../bullmq';
import { FileStorageModule } from '../file-storage';
import { SearchModule } from '../search';
import { DocumentVersionController } from './document-version.controller';
import { DocumentVersionService } from './document-version.service';

@Module({
    imports: [BullmqModule, FileStorageModule, SearchModule],
    controllers: [DocumentVersionController],
    providers: [DocumentVersionService],

    exports: [DocumentVersionService],
})
export class DocumentVersionModule {}
