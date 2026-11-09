import { Module } from '@nestjs/common';
import { SyncService } from './application/sync.service';
import { SyncController } from './presentation/sync.controller';
import { PoliticModule } from '../politic/politic.module';
import { EmployeesParserModule } from '../employees-parser/employees-parser.module';
import { UserProvisioningModule } from '../user-provisioning/user-provisioning.module';

@Module({
    imports: [PoliticModule, EmployeesParserModule, UserProvisioningModule],
    controllers: [SyncController],
    providers: [SyncService],
})
export class SyncModule {}
