import { Global, Module } from '@nestjs/common';
import { PermissionResolverService } from './permission-resolver.service';
import { NodeTreeRepository } from '../../../modules/node/domain/node-tree.repository';
@Global()
@Module({
    providers: [PermissionResolverService, NodeTreeRepository],
    exports: [PermissionResolverService],
})
export class AccessControlModule {}
