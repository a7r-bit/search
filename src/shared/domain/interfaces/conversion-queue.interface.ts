import { DocumentConversionJobDto } from '../../infrastructure/bullmq/queues/document-conversion/dto/document-conversion-job.dto';

export const CONVERSION_QUEUE = Symbol();

export interface ConversionQueue {
    addConversionJob(payload: DocumentConversionJobDto): Promise<void>;
}
