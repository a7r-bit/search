import { Module } from '@nestjs/common';
import { PoliticService } from './politic.service';
import { EmployeesParserModule } from '../../infrastructure/employees-parser';
import { PoliticController } from './politic.controller';
import { NodeAdminGuard } from '../../common/guards/node-admin.guard';

@Module({
    imports: [EmployeesParserModule],
    controllers: [PoliticController],
    providers: [PoliticService, NodeAdminGuard],
    exports: [PoliticService],
})
export class PoliticModule {}