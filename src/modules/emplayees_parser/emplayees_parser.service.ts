import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';
import { DepartmentExternalDto, UserExternalDto } from './dto/user-external.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class EmplayersParserService {
    private client: AxiosInstance;
    private readonly logger = new Logger(EmplayersParserService.name);

    constructor(private readonly configService: ConfigService) {
        const username = this.configService.get<string>('EMPLOYEES_USERNAME');
        const password = this.configService.get<string>('EMPLOYEES_PASSWORD');
        const token = Buffer.from(`${username}:${password}`).toString('base64');
        this.client = axios.create({
            baseURL: this.configService.get<string>('EMPLOYEES_API_URL'),
            headers: {
                Authorization: `Basic ${token}`,
            },
            timeout: 10000,
        });
    }

    async getUsersList(page = 1, limit = 100, order_dir = 'asc'): Promise<UserExternalDto[]> {
        try {
            const data = await this.client.get('api/workers/', {
                params: { page, limit, order_dir },
            });

            return data.data.map((user) => plainToInstance(UserExternalDto, user, { excludeExtraneousValues: true }));
        } catch (e) {
            this.logger.error(`Error fetching users list: ${e.message}`);
            throw new BadRequestException('Ошибка при получении списка сотрудников');
        }
    }
    async getDepartmentsList(page = 1, limit = 100, order_dir = 'asc'): Promise<DepartmentExternalDto[]> {
        try {
            const data = await this.client.get('api/departments/', {
                params: { page, limit, order_dir },
            });
            const departments = plainToInstance(DepartmentExternalDto, data.data as object[], { excludeExtraneousValues: true });
            return await this.getDepartmentArrayFromHierarchy(departments);
        } catch (e) {
            this.logger.error(`Error fetching departments list: ${e.message}`);
            throw new BadRequestException('Ошибка при получении списка подразделений');
        }
    }
    async getUserByTabNumber(tabNumber: string): Promise<UserExternalDto> {
        try {
            const data = await this.client.get(`/api/workers/by-tab-num/${tabNumber}`, {});
            return plainToInstance(UserExternalDto, data.data, { excludeExtraneousValues: true });
        } catch (e) {
            this.logger.error(`Error fetching user by tab number ${tabNumber}: ${e.message}`);
            throw new BadRequestException('Данные пользователя не найдены');
        }
    }

    async getDepartmentArrayFromHierarchy(departments: DepartmentExternalDto[]): Promise<DepartmentExternalDto[]> {
        const result = [];
        async function walk(nodes: any[]) {
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
