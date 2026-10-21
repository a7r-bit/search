import { Injectable } from '@nestjs/common';
import { SearchReader } from '../../common/interfaces/search/search-reader.interface';
import { IndexWriter } from '../../common/interfaces/search/index-writer.interface';
import { SearchIndexPayload, SearchUpdatePayload, SearchDeletePayload } from '../../common/interfaces/search/search-payload.interface';
import { SearchResult } from '../../common/dto/search/search-hit.dto';
import { SearchQuery } from '../../common/dto/search/search-query.dto';
import { SearchApiClient } from '../../infrastructure/http/clients/search-api.client';

@Injectable()
export class SearchService implements IndexWriter, SearchReader {
    constructor(private readonly searchClient: SearchApiClient) {}

    async search(query: SearchQuery): Promise<SearchResult> {
        return this.searchClient.search(query);
    }

    async index(entity: SearchIndexPayload): Promise<void> {
        return this.searchClient.index(entity);
    }

    async update(entity: SearchUpdatePayload): Promise<void> {
        return this.searchClient.update(entity);
    }

    async delete(entity: SearchDeletePayload): Promise<void> {
        return this.searchClient.delete(entity);
    }
}
