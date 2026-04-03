import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import { ElasticTypes } from '../../../../common/constants';
import { ESJobData, ESJobResult } from './elasticsearch.types';

@Injectable()
export class ElasticSearchProducer {
    constructor(@InjectQueue('elasticsearch') private esQueue: Queue<ESJobData>) {}

    async indexAsync(indexName: ElasticTypes, id: string, doc: any) {
        await this.esQueue.add('index', {
            operation: 'index',
            indexName,
            id,
            doc,
        });
    }
    async updateAsync(indexName: ElasticTypes, id: string, doc: any) {
        await this.esQueue.add('update', {
            operation: 'update',
            indexName,
            id,
            doc: doc,
        });
        console.log(`📤 Job added: update/${indexName}/${id}`);
    }

    async deleteAsync(indexName: ElasticTypes, id: string) {
        await this.esQueue.add('delete', {
            operation: 'delete',
            indexName,
            id,
        });
        console.log(`📤 Job added: delete/${indexName}/${id}`);
    }
}
