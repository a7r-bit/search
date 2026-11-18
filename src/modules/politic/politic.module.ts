import { Module } from '@nestjs/common';
import { PoliticService } from './application/politic.service';
import { EmployeesParserModule } from '../employees-parser/employees-parser.module';
import { PoliticController } from './presentation/politic.controller';
import { NodeInfrastructureModule } from '../node/node-infrastructure.module';
import { GroupRepository } from './domain/group.repository';

@Module({
    imports: [EmployeesParserModule, NodeInfrastructureModule],
    controllers: [PoliticController],
    providers: [PoliticService, GroupRepository],
    exports: [PoliticService],
})
export class PoliticModule {}
