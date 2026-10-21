import { Module } from '@nestjs/common';
import { SearchApiClient } from './clients/search-api.client';
import { GotenbergClient } from './clients/gotenberg.client';
import { EmployeesApiClient } from './clients/employees-api.client';

@Module({
    providers: [SearchApiClient, GotenbergClient, EmployeesApiClient],
    exports: [SearchApiClient, GotenbergClient, EmployeesApiClient],
})
export class HttpInfrastructureModule {}
