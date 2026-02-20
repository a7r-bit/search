import { Module } from '@nestjs/common';
import { ImportService } from './import.service';
import { ImportController } from './import.controller';
import { DocumentVersionModule, NodeModule } from 'src/modules';

@Module({
  imports: [NodeModule, DocumentVersionModule],
  controllers: [ImportController],
  providers: [ImportService],
})
export class ImportModule { }
