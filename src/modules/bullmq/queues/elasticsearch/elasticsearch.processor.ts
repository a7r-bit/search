import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { SearchService } from '../../../search';
import { ESJobResult } from './elasticsearch.types';

@Processor('elasticsearch')
export class ElasticsearchProcessor extends WorkerHost {
    private readonly logger = new Logger(ElasticsearchProcessor.name);

    constructor(private searchService: SearchService) {
        super();
    }
    async process(job: Job, token?: string): Promise<ESJobResult> {
        const { operation, indexName, id, doc } = job.data;
        try {
            switch (operation) {
                case 'index':
                    await this.searchService.indexDocument(indexName, id, doc);
                    return { operation: 'index', success: true };
                case 'update':
                    await this.searchService.updateDocument(indexName, id, doc);
                    return { operation: 'update', success: true };
                case 'delete':
                    await this.searchService.deleteDocument(indexName, id);
                    return { operation: 'delete', success: true };
                default:
                    throw new Error(`Unknown operation: ${operation}`);
            }
        } catch (error) {
            // this.logger.error(`Failed to ${operation}: ${error.message}`);
            throw error;
        }
    }
    @OnWorkerEvent('completed')
    onCompleted(job: Job) {
        this.logger.log(`✔ Job ${job.id} выполнена`);
    }

    @OnWorkerEvent('failed')
    async onFailed(job: Job, err: Error) {
        this.logger.error(`🧨 Job ${job.id} завершилась ошибкой`, err.stack || err.message);
    }
}
