import { SearchDeletePayload, SearchIndexPayload } from './search-payload.interface';

export const INDEX_WRITER = Symbol('IndexWriter');

export interface IndexWriter {
    index(entity: SearchIndexPayload): Promise<void>;
    update(entity: SearchIndexPayload): Promise<void>;
    delete(entity: SearchDeletePayload): Promise<void>;
}
