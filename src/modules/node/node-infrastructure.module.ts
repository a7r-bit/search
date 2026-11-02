import { Module } from '@nestjs/common';
import { NodeRepository } from '../node/node.repository';
import { NodeTreeRepository } from '../node/node-tree.repository';

@Module({
    providers: [NodeRepository, NodeTreeRepository],
    exports: [NodeRepository, NodeTreeRepository],
})
export class NodeInfrastructureModule {}
