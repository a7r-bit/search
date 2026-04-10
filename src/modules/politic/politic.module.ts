import { Module } from '@nestjs/common';
import { PoliticService } from './politic.service';
import { EmployeesParserModule } from '../../infrastructure/employees-parser';

@Module({
    imports: [EmployeesParserModule],
    providers: [PoliticService],
    exports: [PoliticService],
})
export class PoliticModule {}
