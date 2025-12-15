import { forwardRef, Module } from '@nestjs/common';
import { DocumentVersionService } from './document-version.service';
import { DocumentVersionController } from './document-version.controller';
import { DocumentModule } from '../document/document.module';
import { BullmqModule } from '../bullmq/bullmq.module';
import { FileStorageModule } from '../file-storage/file-storage.module';
import { SearchModule } from '../search';

@Module({
  imports: [forwardRef(() => DocumentModule), BullmqModule, FileStorageModule, SearchModule],
  controllers: [DocumentVersionController],
  providers: [DocumentVersionService],
  exports: [DocumentVersionService]

})
export class DocumentVersionModule { }
