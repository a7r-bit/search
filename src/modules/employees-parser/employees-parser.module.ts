import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EmployeesParserService } from './application/employees-parser.service';
import { HttpInfrastructureModule } from '../../shared/infrastructure/http/http.module';

@Module({
    imports: [ConfigModule, HttpInfrastructureModule],
    providers: [EmployeesParserService],
    exports: [EmployeesParserService],
})
export class EmployeesParserModule {}
