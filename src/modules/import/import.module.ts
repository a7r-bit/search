import { Module } from '@nestjs/common';
import { ImportService } from './import.service';
import { ImportController } from './import.controller';
import { NodeModule } from '../node';
import { DocumentVersionModule } from '../document-version';

@Module({
  imports: [NodeModule, DocumentVersionModule],
  controllers: [ImportController],
  providers: [ImportService],
})
export class ImportModule { }
