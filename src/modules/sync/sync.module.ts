import { Module } from '@nestjs/common';
import { SyncService } from './sync.service';
import { SyncController } from './sync.controller';
import { PoliticModule } from '../politic';
import { EmployeesParserModule } from '../../infrastructure';
import { UserProvisioningModule } from '../../user-provisioning/user-provisioning.module';

@Module({
    imports: [PoliticModule, EmployeesParserModule, UserProvisioningModule],
    controllers: [SyncController],
    providers: [SyncService],
})
export class SyncModule {}
