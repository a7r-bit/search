import { Module } from '@nestjs/common';
import { PoliticService } from './application/politic.service';
import { EmployeesParserModule } from '../employees-parser/employees-parser.module';
import { PoliticController } from './presentation/politic.controller';
import { NodeInfrastructureModule } from '../node/node-infrastructure.module';

@Module({
    imports: [EmployeesParserModule, NodeInfrastructureModule],
    controllers: [PoliticController],
    providers: [PoliticService],
    exports: [PoliticService],
})
export class PoliticModule {}
