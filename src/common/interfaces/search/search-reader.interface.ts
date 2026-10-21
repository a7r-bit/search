import { SearchResult } from '../../dto/search/search-hit.dto';
import { SearchQuery } from '../../dto/search/search-query.dto';

export const SEARCH_READER = Symbol('SearchReader');

export interface SearchReader {
    search(query: SearchQuery): Promise<SearchResult>;
}
