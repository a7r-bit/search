import { Module } from '@nestjs/common';
import { PoliticService } from './politic.service';
import { EmployeesParserModule } from '../../infrastructure/employees-parser/employees-parser.module';
import { PoliticController } from './politic.controller';

@Module({
    imports: [EmployeesParserModule],
    controllers: [PoliticController],
    providers: [PoliticService],
    exports: [PoliticService],
})
export class PoliticModule {}
