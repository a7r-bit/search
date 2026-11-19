import { Module } from '@nestjs/common';
import { GroupService } from './application/group.service';
import { NodeAccessPolicyService } from './application/node-access-policy.service';
import { EmployeesParserModule } from '../employees-parser/employees-parser.module';
import { PoliticController } from './presentation/politic.controller';
import { NodeInfrastructureModule } from '../node/node-infrastructure.module';
import { GroupRepository } from './domain/group.repository';

@Module({
    imports: [EmployeesParserModule, NodeInfrastructureModule],
    controllers: [PoliticController],
    providers: [GroupService, NodeAccessPolicyService, GroupRepository],
    exports: [GroupService, NodeAccessPolicyService],
})
export class PoliticModule {}
