import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';
import { SearchIndexPayload, SearchDeletePayload } from '../../../../modules/search/domain/search-payload.interface';
import { SearchResult } from '../../../../modules/search/presentation/dto/search-hit.dto';
import { SearchQuery } from '../../../../modules/search/presentation/dto/search-query.dto';

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
            baseURL: this.baseUrl,
            headers: {
                'x-tenant-id': this.tenantId,
            },
        });
    }

    async search(query: SearchQuery): Promise<SearchResult> {
        const { data } = await this.client.get<SearchResult>('/search/query', {
            params: {
                query: query.query,
                kind: query.kind,
                externalIds: query.externalIds,
                matchType: query.matchType,
                page: query.page,
                limit: query.limit,
                sortBy: query.sortBy,
            },
        });
        return data;
    }

    async index(payload: SearchIndexPayload): Promise<void> {
        await this.client.post('/search/index', payload);
    }

    async update(payload: SearchIndexPayload): Promise<void> {
        await this.client.post('/search/update', payload);
    }

    async delete(payload: SearchDeletePayload): Promise<void> {
        await this.client.delete('/search/delete', { data: payload });
    }
}
