import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EmployeesParserService } from './employees-parser.service';
import { HttpInfrastructureModule } from '../http/http.module';

@Module({
    imports: [ConfigModule, HttpInfrastructureModule],
    providers: [EmployeesParserService],
    exports: [EmployeesParserService],
})
export class EmployeesParserModule {}
