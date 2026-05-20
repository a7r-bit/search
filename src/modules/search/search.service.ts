import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { ElasticTypes } from '../../common/constants';

/**
 * Для совместимости: в ES 8 клиенте:
 * - index: { index, id?, document, refresh? }
 * - get: { index, id }
 * - search: { index, query, from?, size?, sort?, track_total_hits? }
 * - update: { index, id, doc, doc_as_upsert? }
 * - delete: { index, id }
 */

@Injectable()
export class SearchService {
    constructor(private readonly elasticSearchService: ElasticsearchService) {}

    async search<T>(searchQuery: string, nodeIds: string[]) {
        const normalizedQuery = searchQuery.trim();
        const isShort = normalizedQuery.length <= 3;
        const tokenCount = normalizedQuery.split(/\s+/).filter(Boolean).length;
        const useStrictMatching = isShort || tokenCount === 1;

        if (nodeIds.length === 0) {
            return await this.elasticSearchService.search<T>({
                index: [ElasticTypes.Node, ElasticTypes.DocumentVersion],
                size: 10,
                track_total_hits: true,
                query: { match_none: {} },
            });
        }

        const textQuery = {
            multi_match: {
                query: normalizedQuery,
                type: 'best_fields' as const,
                fields: [
                    'content^5',
                    'fileName^3',
                    'fileName.keyword^4',
                    'name^2',
                    'description',
                ],
                ...(useStrictMatching
                    ? { operator: 'and' as const }
                    : { operator: 'or' as const, minimum_should_match: '70%' }),
                ...(!isShort ? { fuzziness: 'AUTO' as const } : {}),
            },
        };

        return await this.elasticSearchService.search<T>({
            index: [ElasticTypes.Node, ElasticTypes.DocumentVersion],
            size: 10,
            track_total_hits: true,
            query: {
                bool: {
                    should: [
                        {
                            bool: {
                                filter: [
                                    { term: { _index: ElasticTypes.DocumentVersion } },
                                    { terms: { nodeId: nodeIds } },
                                ],
                                must: [textQuery],
                            },
                        },
                        {
                            bool: {
                                filter: [
                                    { term: { _index: ElasticTypes.Node} },
                                    { term: { type: "DIRECTORY"} },
                                    { ids: { values: nodeIds } },
                                ],
                                must: [textQuery],
                            },
                        },
                    ],
                    minimum_should_match: 1,
                },
            },
            highlight: {
                encoder: 'html',
                type: 'unified',
                pre_tags: ['<mark>'],
                post_tags: ['</mark>'],
                require_field_match: false,
                fields: {
                    name: {
                        number_of_fragments: 0,
                    },
                    description: {
                        number_of_fragments: 0,
                    },
                    fileName: {
                        number_of_fragments: 0,
                    },
                    content: {
                        fragment_size: 150,
                        number_of_fragments: 2,
                        order: 'score',
                    },
                },
            },
            sort: [{ _score: { order: 'desc' } }],
        });
    }

    async indexDocument<T>(index: ElasticTypes, id: string, document: T) {
        return await this.elasticSearchService.index<T>({
            index,
            id,
            document,
        });
    }

    async updateDocument<T>(index: ElasticTypes, id: string, document: T) {
        return await this.elasticSearchService.update<T>({
            index,
            id,
            doc: document,
            doc_as_upsert: true,
        });
    }

    async deleteDocument(index: ElasticTypes, id: string) {
        return await this.elasticSearchService.delete({
            index,
            id,
        });
    }
}
