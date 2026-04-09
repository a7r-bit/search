import { BullModule } from '@nestjs/bullmq';
import { Logger, Module } from '@nestjs/common';
import { DocumentConversionProcessor } from './queues/document-conversion/document-conversion.processor';
import { DocumentConversionService } from './queues/document-conversion/document-conversion.service';
import { GotenbergModule } from '../gotenberg';
import { FileStorageModule } from '../file-storage';
import { PdfModule } from '../pdf';
import { SearchModule } from '../search';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ElasticSearchProducer } from './queues/elasticsearch/elasticsearch.producer';
import { ElasticsearchProcessor } from './queues/elasticsearch/elasticsearch.processor';
import { S3Module } from '../../infrastructure/s3';

@Module({
    imports: [
        BullModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (config: ConfigService) => {
                const host = config.get<string>('REDIS_HOST');
                const port = config.get<number>('REDIS_PORT');

                return {
                    connection: {
                        host: `${host}`,
                        port: port,
                    },
                };
            },
        }),
        BullModule.registerQueue(
            {
                name: 'documentConversion',
                defaultJobOptions: {
                    attempts: 3,
                    backoff: { type: 'exponential', delay: 2000 },
                    removeOnComplete: true,
                },
            },
            {
                name: 'elasticsearch',
                defaultJobOptions: {
                    attempts: 5,
                    backoff: { type: 'exponential', delay: 1000 },
                    removeOnComplete: 100,
                    removeOnFail: 500,
                },
            },
        ),
        ConfigModule,
        GotenbergModule,
        FileStorageModule,
        PdfModule,
        SearchModule,
        S3Module,
    ],
    providers: [DocumentConversionProcessor, DocumentConversionService, ElasticsearchProcessor, ElasticSearchProducer],
    exports: [DocumentConversionService, ElasticSearchProducer],
})
export class BullmqModule {}
