import { forwardRef, Module } from '@nestjs/common';
import { NodeController } from './node.controller';
import { NodeService } from './node.service';
import { SearchModule } from '../search';
import { DocumentVersionModule } from '../document-version';

@Module({
  imports: [SearchModule, DocumentVersionModule],
  controllers: [NodeController],
  providers: [NodeService],
  exports: [NodeService]
})
export class NodeModule { }
