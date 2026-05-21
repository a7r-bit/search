import { ElasticTypes } from '../../common/constants';

const sharedAnalysis = {
    analyzer: {
        search_icu: {
            type: 'custom',
            tokenizer: 'icu_tokenizer',
            filter: ['icu_folding', 'lowercase'],
        },
    },
} as const;

const textField = {
    type: 'text',
    analyzer: 'search_icu',
    search_analyzer: 'search_icu',
} as const;

const searchableTextField = {
    ...textField,
    fields: {
        keyword: {
            type: 'keyword',
            ignore_above: 512,
        },
    },
} as const;

export const elasticsearchIndexDefinitions = {
    [ElasticTypes.DocumentVersion]: {
        settings: {
            analysis: sharedAnalysis,
        },
        mappings: {
            properties: {
                content: textField,
                fileName: searchableTextField,
                nodeId: { type: 'keyword' },
                path: { type: 'keyword' },
                version: { type: 'integer' },
                createdAt: { type: 'date' },
            },
        },
    },
    [ElasticTypes.Node]: {
        settings: {
            analysis: sharedAnalysis,
        },
        mappings: {
            properties: {
                name: searchableTextField,
                description: textField,
                type: { type: 'keyword' },
                parentId: { type: 'keyword' },
            },
        },
    },
} as const;
