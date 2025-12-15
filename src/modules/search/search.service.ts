import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { ElasticTypes } from 'src/common/constants';

@Injectable()
export class SearchService {
    constructor(private readonly elasticSearchService: ElasticsearchService) { }

    async search<T>(index: ElasticTypes, query: Record<string, any>) {
        return await this.elasticSearchService.search<T>({
            index,
            body: {
                query
            }
        });
    };

    async indexDocument<T>(index: ElasticTypes, id: string, document) {
        return await this.elasticSearchService.index<T>({
            index,
            id,
            body: document

        });
    }

    async updateDocument<T>(index: ElasticTypes, id: string, document) {
        return await this.elasticSearchService.update<T>({
            index,
            id,
            body: {
                doc: document,
                doc_as_upsert: true
            },

        })
    }

    async deleteDocument<T>(index: ElasticTypes, id: string) {
        return await this.elasticSearchService.delete<T>({
            index,
            id,
        })
    }
}
