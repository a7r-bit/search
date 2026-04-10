import { Controller, Post, UseGuards } from '@nestjs/common';
import { SyncService } from './sync.service';
import { Role } from '../../common/decorators';
import { AppRole } from '../../common/constants';
import { ApiBearerAuth } from '@nestjs/swagger';
import { RoleGuard } from '../../common/guards/role.guard';
import { Public } from '../../common/decorators/public.decorator';

@Controller('sync')
@ApiBearerAuth('access-token')
export class SyncController {
  constructor(private readonly syncService: SyncService) {}


  @Post('sync-users')
  @UseGuards(RoleGuard)
  @Role(AppRole.OWNER)
  async syncUsers(){
    return await this.syncService.syncUsers();
  }
  @Post('sync-groups')
  @UseGuards(RoleGuard)
  @Role(AppRole.OWNER)
  async syncGroups(){
    return await this.syncService.syncGroups();
  }
}
