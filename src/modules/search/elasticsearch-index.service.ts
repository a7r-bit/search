import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { ElasticTypes } from '../../common/constants';
import { elasticsearchIndexDefinitions } from './elasticsearch-index.config';

@Injectable()
export class ElasticsearchIndexService implements OnModuleInit {
    private readonly logger = new Logger(ElasticsearchIndexService.name);

    constructor(private readonly elasticsearchService: ElasticsearchService) {}

    async onModuleInit() {
        try {
            await this.ensureIndices();
        } catch (error) {
            this.logger.warn(
                'Failed to initialize Elasticsearch indices. Search will be unavailable until ES is reachable.',
            );
            this.logger.warn(error instanceof Error ? error.message : String(error));
        }
    }

    async ensureIndices() {
        for (const indexName of Object.values(ElasticTypes)) {
            await this.ensureIndex(indexName);
        }
    }

    private async ensureIndex(indexName: ElasticTypes) {
        const exists = await this.elasticsearchService.indices.exists({ index: indexName });

        if (exists) {
            this.logger.log(`Elasticsearch index "${indexName}" already exists`);
            return;
        }

        const definition = elasticsearchIndexDefinitions[indexName];

        await this.elasticsearchService.indices.create({
            index: indexName,
            settings: definition.settings as Record<string, unknown>,
            mappings: definition.mappings as Record<string, unknown>,
        });

        this.logger.log(`Elasticsearch index "${indexName}" created`);
    }
}
