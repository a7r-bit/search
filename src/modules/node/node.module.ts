import { forwardRef, Module } from '@nestjs/common';
import { NodeController } from './node.controller';
import { NodeService } from './node.service';
import { SearchModule } from '../search';
import { DocumentVersionModule } from '../document-version';
import { CheckGroupPolitic } from '../../common/guards/group-politic.guard';
import { PoliticModule } from '../politic/politic.module';

@Module({
  imports: [SearchModule, DocumentVersionModule, PoliticModule],
  controllers: [NodeController],
  providers: [NodeService, CheckGroupPolitic],
  exports: [NodeService]
})
export class NodeModule { }
