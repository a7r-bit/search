import { Global, Module } from '@nestjs/common';
import { PermissionResolverService } from './resolver.service';
import { NodeTreeRepository } from '../node/node-tree.repository';
@Global()
@Module({
    providers: [PermissionResolverService, NodeTreeRepository],
    exports: [PermissionResolverService],
})
export class AccessControlModule {}
