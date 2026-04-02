import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import { ElasticTypes } from '../../../../common/constants';
import { ESJobData, ESJobResult } from './elasticsearch.types';

@Injectable()
export class ElasticSearchProducer {
    constructor(@InjectQueue('elasticsearch') private esQueue: Queue<ESJobData>) {}

    async indexAsync(indexName: ElasticTypes, id: string, body: any) {
        await this.esQueue.add('index', {
            operation: 'index',
            indexName,
            id,
            body,
        });
    }
    async updateAsync(indexName: ElasticTypes, id: string, body: any) {
        await this.esQueue.add('update', {
            operation: 'update',
            indexName,
            id,
            body,
        });
    }

    async deleteAsync(indexName: ElasticTypes, id: string) {
        await this.esQueue.add('delete', {
            operation: 'delete',
            indexName,
            id,
        });
    }
}
