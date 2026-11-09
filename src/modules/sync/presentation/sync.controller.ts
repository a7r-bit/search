import { Controller, Post, UseGuards } from '@nestjs/common';
import { SyncService } from '../application/sync.service';
import { Role } from '../../../shared/presentation/decorators/role.decorator';
import { AppRole } from '../../../shared/domain/constants';
import { ApiBearerAuth } from '@nestjs/swagger';
import { RoleGuard } from '../../../shared/presentation/guards/role.guard';

@Controller('sync')
@ApiBearerAuth('access-token')
export class SyncController {
    constructor(private readonly syncService: SyncService) {}

    @Post('sync-users')
    @UseGuards(RoleGuard)
    @Role(AppRole.OWNER)
    async syncUsers() {
        return await this.syncService.syncUsers();
    }
    @Post('sync-groups')
    @UseGuards(RoleGuard)
    @Role(AppRole.OWNER)
    async syncGroups() {
        return await this.syncService.syncGroups();
    }
}
