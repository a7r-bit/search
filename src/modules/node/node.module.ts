import { Module } from '@nestjs/common';
import { NodeController } from './presentation/node.controller';
import { NodeService } from './application/node.service';
import { NodeTreeService } from './application/node-tree.service';
import { DocumentVersionModule } from '../document-version/document-version.module';
import { PoliticModule } from '../politic/politic.module';
import { BullmqModule } from '../../shared/infrastructure/bullmq/bullmq.module';
import { NodeInfrastructureModule } from './node-infrastructure.module';
import { AccessControlModule } from '../../shared/application/permission/permission.module';

@Module({
    imports: [DocumentVersionModule, PoliticModule, BullmqModule, NodeInfrastructureModule, AccessControlModule],
    controllers: [NodeController],
    providers: [NodeService, NodeTreeService],
    exports: [NodeService],
})
export class NodeModule {}
