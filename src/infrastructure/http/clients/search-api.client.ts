import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';
import { SearchIndexPayload, SearchUpdatePayload, SearchDeletePayload } from '../../../common/interfaces/search/search-payload.interface';
import { SearchResult } from '../../../common/dto/search/search-hit.dto';
import { SearchQuery } from '../../../common/dto/search/search-query.dto';

@Injectable()
export class SearchApiClient {
    private readonly client: AxiosInstance;
    private readonly baseUrl: string;
    private readonly tenantId: string;

    constructor(private readonly config: ConfigService) {
        this.baseUrl = this.config.get<string>('SEARCH_SERVICE_URL');
        this.tenantId = this.config.get<string>('SEARCH_TENANT_ID');
        if (!this.baseUrl || !this.tenantId) {
            throw new Error('SEARCH_SERVICE_URL and SEARCH_TENANT_ID must be defined in the environment');
        }
        this.client = axios.create({
            baseURL: this.config.get<string>('SEARCH_SERVICE_URL'),
            headers: {
                'x-tenant-id': this.tenantId,
            },
        });

        if (!this.config.get<string>('SEARCH_SERVICE_URL')) {
            throw new Error('SEARCH_SERVICE_URL must be defined in the environment');
        }
    }

    async search(query: SearchQuery): Promise<SearchResult> {
        const { data } = await this.client.post<SearchResult>('/search', query);
        return data;
    }

    async index(payload: SearchIndexPayload): Promise<void> {
        await this.client.post('/index', payload);
    }

    async update(payload: SearchUpdatePayload): Promise<void> {
        await this.client.put('/update', payload);
    }

    async delete(payload: SearchDeletePayload): Promise<void> {
        await this.client.delete(`/delete/${payload.externalId}`);
    }
}
