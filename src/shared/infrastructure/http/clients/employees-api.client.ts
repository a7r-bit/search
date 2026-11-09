import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';
import * as http from 'http';
import * as https from 'https';
import { DepartmentExternalDto } from '../../../../modules/employees-parser/domain/dto/user-external.dto';

@Injectable()
export class EmployeesApiClient {
    private readonly client: AxiosInstance;

    constructor(private readonly config: ConfigService) {
        const username = this.config.get<string>('EMPLOYEES_USERNAME');
        const password = this.config.get<string>('EMPLOYEES_PASSWORD');
        const url = this.config.get<string>('EMPLOYEES_API_URL');
        if (!url) throw new Error('EMPLOYEES_API_URL is not defined');
        const token = Buffer.from(`${username}:${password}`).toString('base64');
        this.client = axios.create({
            baseURL: url,
            timeout: 10000,
            headers: {
                Authorization: `Basic ${token}`,
            },
            proxy: false,
            httpsAgent: new https.Agent({
                rejectUnauthorized: false,
            }),
            httpAgent: new http.Agent({
                keepAlive: true,
            }),
        });
    }

    async fetchEmployees(page: number = 1, limit: number = 10, order_dir: string): Promise<any> {
        const response = await this.client.get('/api/workers/', { params: { page, limit, order_dir } });
        return response.data;
    }
    async fetchDepartments(page: number = 1, limit: number = 10, order_dir: string): Promise<any> {
        const response = await this.client.get('/api/departments/', { params: { page, limit, order_dir } });
        return response.data;
    }
    async fetchUserByTabNumber(tabNumber: string): Promise<any> {
        const data = await this.client.get(`/api/workers/by-tab-num/${tabNumber}`, {});
        return data.data;
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
