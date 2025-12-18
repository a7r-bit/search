import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { ElasticTypes } from 'src/common/constants';



/**
 * Для совместимости: в ES 8 клиенте:
 * - index: { index, id?, document, refresh? }
 * - get: { index, id }
 * - search: { index, query, from?, size?, sort?, track_total_hits? }
 * - update: { index, id, doc, doc_as_upsert? }
 * - delete: { index, id }
 *
 */

@Injectable()
export class SearchService {
    constructor(private readonly elasticSearchService: ElasticsearchService) { }

    async search<T>(index: ElasticTypes, query: Record<string, any>) {
        return await this.elasticSearchService.search<T>({
            index,
            query
        });
    };

    async indexDocument<T>(index: ElasticTypes, id: string, document: T) {
        return await this.elasticSearchService.index<T>({
            index,
            id,
            document
        });
    }

    async updateDocument<T>(index: ElasticTypes, id: string, document) {
        return await this.elasticSearchService.update<T>({
            index,
            id,
            doc: document,
            doc_as_upsert: true
        })
    }

    async deleteDocument(index: ElasticTypes, id: string) {
        return await this.elasticSearchService.delete({
            index,
            id,
        })
    }
}
