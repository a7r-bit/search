import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import { DocumentConversionJobDto } from './dto/document-conversion-job.dto';
import { ConversionQueue } from '../../../../domain/interfaces/conversion-queue.interface';

@Injectable()
export class DocumentConversionService implements ConversionQueue {
    constructor(@InjectQueue('documentConversion') private documentConversionQueue: Queue<DocumentConversionJobDto>) {}
    async addConversionJob(data: DocumentConversionJobDto) {
        await this.documentConversionQueue.add('documentConversion', data, {
            jobId: data.documentVersionId,
            backoff: { type: 'exponential', delay: 5000 },
        });
    }
}
