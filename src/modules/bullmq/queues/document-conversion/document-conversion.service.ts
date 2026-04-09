import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import { DocumentConversionJobDto } from './dto/document-conversion-job.dto';

@Injectable()
export class DocumentConversionService {
    constructor(@InjectQueue('documentConversion') private documentConversionQueue: Queue) {}
    async addConversionJob(data: DocumentConversionJobDto) {
        await this.documentConversionQueue.add(
            'documentConversion',
            data,
            {
                jobId: data.documentVersionId,
                backoff: { type: 'exponential', delay: 5000 },
            },
        );
    }
}
