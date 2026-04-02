import { BullModule } from '@nestjs/bullmq';
import { Logger, Module } from '@nestjs/common';
import { DocumentConversionProcessor } from './queues/document-conversion/document-conversion.processor';
import { DocumentConversionService } from './queues/document-conversion/document-conversion.service';
import { GotenbergModule } from '../gotenberg/gotenberg.module';
import { FileStorageModule } from '../file-storage/file-storage.module';
import { PdfModule } from '../pdf/pdf.module';
import { SearchModule } from '../search';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ElasticSearchProducer } from './queues/elasticsearch/elasticsearch.producer';

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
    ],
    providers: [DocumentConversionProcessor, DocumentConversionService, ElasticSearchProducer],
    exports: [DocumentConversionService, ElasticSearchProducer],
})
export class BullmqModule {}
