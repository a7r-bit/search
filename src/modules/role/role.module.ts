import { Module } from '@nestjs/common';
import { RoleService } from './application/role.service';

@Module({
    providers: [RoleService],
    exports: [RoleService],
})
export class RoleModule {}
