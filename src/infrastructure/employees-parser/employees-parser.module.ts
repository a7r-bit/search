import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EmployeesParserService } from './employees-parser.service';

@Module({
    imports: [ConfigModule],
    providers: [EmployeesParserService],
    exports: [EmployeesParserService],
})
export class EmployeesParserModule {}
