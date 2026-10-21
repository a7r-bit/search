import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { DepartmentExternalDto, UserExternalDto } from './dto/user-external.dto';
import { EmployeesApiClient } from '../http/clients/employees-api.client';
import Logger, { LoggerKey } from '../logger/domain/logger';

@Injectable()
export class EmployeesParserService {
    constructor(
        private readonly employeesClient: EmployeesApiClient,
        @Inject(LoggerKey) private readonly logger: Logger,
    ) {}

    async getUsersList(page = 1, limit = 100, order_dir = 'asc'): Promise<UserExternalDto[]> {
        try {
            const data = await this.employeesClient.fetchEmployees(page, limit, order_dir);

            return data.map((user) => plainToInstance(UserExternalDto, user, { excludeExtraneousValues: true }));
        } catch (e) {
            this.logger.error(`Error fetching users list: ${e.message}`);
            throw new BadRequestException('Ошибка при получении списка сотрудников');
        }
    }

    async getDepartmentsList(page = 1, limit = 100, order_dir = 'asc'): Promise<DepartmentExternalDto[]> {
        try {
            const data = await this.employeesClient.fetchDepartments(page, limit, order_dir);
            const departments = plainToInstance(DepartmentExternalDto, data as object[], { excludeExtraneousValues: true });
            return await this.getDepartmentArrayFromHierarchy(departments);
        } catch (e) {
            this.logger.error(`Error fetching departments list: ${e.message}`);
            throw new BadRequestException('Ошибка при получении списка подразделений');
        }
    }

    async getUserByTabNumber(tabNumber: string): Promise<UserExternalDto> {
        try {
            const data = await this.employeesClient.fetchUserByTabNumber(tabNumber);
            return plainToInstance(UserExternalDto, data);
        } catch (e) {
            this.logger.error(`Error fetching user by tab number ${tabNumber}: ${e.message}`);
            throw new BadRequestException('Данные пользователя не найдены');
        }
    }

    async getDepartmentArrayFromHierarchy(departments: DepartmentExternalDto[]): Promise<DepartmentExternalDto[]> {
        const result = [];
        async function walk(nodes: DepartmentExternalDto[]) {
            for (const node of nodes) {
                result.push({ id: node.id, name: node.name, children: node.children });
                if (node.children) {
                    await walk(node.children);
                }
            }
        }
        await walk(departments);
        return result;
    }
}
