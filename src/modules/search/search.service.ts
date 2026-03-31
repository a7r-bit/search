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
 *
 */

@Injectable()
export class SearchService {
    constructor(private readonly elasticSearchService: ElasticsearchService) {}

    async search<T>(searchQuery: string, allNodesId: (string | null)[]) {
        const isShort = searchQuery.length <= 3;
        const hasNull = allNodesId.includes(null);
        const nodeIds = allNodesId.filter((id): id is string => id !== null);

        return await this.elasticSearchService.search<T>({
            index: [ElasticTypes.Node, ElasticTypes.DocumentVersion],
            size: 10,
            query: {
                bool: {
                    must: [
                        {
                            multi_match: {
                                query: searchQuery,
                                fields: ['content^3', 'fileName^2', 'name^1', 'description^0.5'],
                                ...(isShort ? {} : { fuzziness: 'AUTO' }),
                            },
                        },
                    ],
                    should: [
                        {
                            bool: {
                                filter: [{ term: { _index: ElasticTypes.DocumentVersion } }, { terms: { nodeId: nodeIds } }],
                            },
                        },
                        {
                            bool: {
                                filter: [
                                    { term: { _index: ElasticTypes.Node } },
                                    {
                                        bool: {
                                            should: [
                                                ...(nodeIds.length ? [{ terms: { parentId: nodeIds } }] : []),
                                                ...(hasNull
                                                    ? [
                                                          {
                                                              bool: {
                                                                  must_not: {
                                                                      exists: { field: 'parentId' },
                                                                  },
                                                              },
                                                          },
                                                      ]
                                                    : []),
                                            ],
                                            minimum_should_match: 1,
                                        },
                                    },
                                ],
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
                        fragment_size: 90,
                        number_of_fragments: 1,
                        order: 'score',
                    },
                },
            },
        });
    }

    async indexDocument<T>(index: ElasticTypes, id: string, document: T) {
        return await this.elasticSearchService.index<T>({
            index,
            id,
            document,
        });
    }

    async updateDocument<T>(index: ElasticTypes, id: string, document) {
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
