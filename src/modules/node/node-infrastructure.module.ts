import { Module } from '@nestjs/common';
import { NodeRepository } from './domain/node.repository';
import { NodeTreeRepository } from './domain/node-tree.repository';

@Module({
    providers: [NodeRepository, NodeTreeRepository],
    exports: [NodeRepository, NodeTreeRepository],
})
export class NodeInfrastructureModule {}
