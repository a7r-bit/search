import { Module } from '@nestjs/common';
import { NodeController } from './node.controller';
import { NodeService } from './node.service';
import { DocumentVersionModule } from '../document-version/document-version.module';
import { CheckGroupPolitic } from '../../common/guards/group-politic.guard';
import { PoliticModule } from '../politic/politic.module';
import { BullmqModule } from '../bullmq/bullmq.module';
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
