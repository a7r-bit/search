import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';

@Injectable()
export class DocumentConversionService {
    constructor(@InjectQueue('documentConversion') private documentConversionQueue: Queue) {}
    async addConversionJob(documentVersionId: string, filePath: string, isPDF: boolean) {
        await this.documentConversionQueue.add(
            'documentConversion',
            { documentVersionId, filePath, isPDF },

            {
                jobId: documentVersionId,
                backoff: { type: 'exponential', delay: 5000 },
            },
        );
    }
}
