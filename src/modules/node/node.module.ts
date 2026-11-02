import { Module } from '@nestjs/common';
import { NodeController } from './node.controller';
import { NodeService } from './node.service';
import { DocumentVersionModule } from '../document-version';
import { CheckGroupPolitic } from '../../common/guards/group-politic.guard';
import { PoliticModule } from '../politic';
import { BullmqModule } from '../bullmq';
import { NodeInfrastructureModule } from './node-infrastructure.module';
import { AccessControlModule } from '../access-control/resolver.module';

@Module({
    imports: [
        DocumentVersionModule, 
        PoliticModule, 
        BullmqModule, 
        NodeInfrastructureModule, 
        AccessControlModule
    ],
    controllers: [NodeController],
    providers: [NodeService, CheckGroupPolitic],
    exports: [NodeService],
})
export class NodeModule {}
