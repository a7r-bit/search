import { Injectable } from '@nestjs/common';
import { SearchReader } from '../domain/search-reader.interface';
import { IndexWriter } from '../domain/index-writer.interface';
import { SearchIndexPayload, SearchDeletePayload } from '../domain/search-payload.interface';
import { SearchResult } from '../presentation/dto/search-hit.dto';
import { SearchQuery } from '../presentation/dto/search-query.dto';
import { SearchApiClient } from '../../../shared/infrastructure/http/clients/search-api.client';

@Injectable()
export class SearchService implements IndexWriter, SearchReader {
    constructor(private readonly searchClient: SearchApiClient) {}

    async search(query: SearchQuery): Promise<SearchResult> {
        return this.searchClient.search(query);
    }

    async index(entity: SearchIndexPayload): Promise<void> {
        return this.searchClient.index(entity);
    }

    async update(entity: SearchIndexPayload): Promise<void> {
        return this.searchClient.update(entity);
    }

    async delete(entity: SearchDeletePayload): Promise<void> {
        return this.searchClient.delete(entity);
    }
}
