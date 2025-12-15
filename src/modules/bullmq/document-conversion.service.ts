import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';

@Injectable()
export class DocumentConversionService {
    constructor(@InjectQueue("documentConversion") private documentConversionQueue: Queue) { }
    async addConversionJob(documentVersionId: string, buffer: Buffer, isPDF: boolean) {
        await this.documentConversionQueue.add(
            "documentConversion",
            { documentVersionId, buffer, isPDF },

            {
                jobId: documentVersionId,
                backoff: { type: 'exponential', delay: 5000 }
            })
    }
}
