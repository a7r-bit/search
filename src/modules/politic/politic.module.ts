import { Module } from '@nestjs/common';
import { PoliticService } from './politic.service';
import { PoliticController } from './politic.controller';
import { EmployeesParserModule } from '../../infrastructure/employees-parser';

@Module({
    imports: [EmployeesParserModule],
    controllers: [PoliticController],
    providers: [PoliticService],
    exports: [PoliticService],
})
export class PoliticModule {}
