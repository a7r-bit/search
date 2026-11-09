import { SearchResult } from '../presentation/dto/search-hit.dto';
import { SearchQuery } from '../presentation/dto/search-query.dto';

export const SEARCH_READER = Symbol('SearchReader');

export interface SearchReader {
    search(query: SearchQuery): Promise<SearchResult>;
}
