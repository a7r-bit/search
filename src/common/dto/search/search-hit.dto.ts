import { Kind } from './search.types';

export interface SearchResult {
    items: SearchHit[];
    total: number;
    page: number;
    limit: number;
}

export class SearchHit {
    tenantId: string;
    externalId: string;
    kind: Kind;
    score: number;
    title: string;
    highlight: Highlight;
}
export class Highlight {
    field: string;
    snippets: string[];
}
