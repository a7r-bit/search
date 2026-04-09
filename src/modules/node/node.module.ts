import { Module } from '@nestjs/common';
import { NodeController } from './node.controller';
import { NodeService } from './node.service';
import { DocumentVersionModule } from '../document-version';
import { CheckGroupPolitic } from '../../common/guards/group-politic.guard';
import { PoliticModule } from '../politic';
import { BullmqModule } from '../bullmq';

@Module({
    imports: [DocumentVersionModule, PoliticModule, BullmqModule],
    controllers: [NodeController],
    providers: [NodeService, CheckGroupPolitic],
    exports: [NodeService],
})
export class NodeModule {}
