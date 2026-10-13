import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { DocumentConversionProcessor } from './queues/document-conversion/document-conversion.processor';
import { DocumentConversionService } from './queues/document-conversion/document-conversion.service';
import { GotenbergModule } from '../gotenberg';
import { PdfModule } from '../pdf';
import { ConfigModule, ConfigService } from '@nestjs/config';
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
        BullModule.registerQueue({
            name: 'documentConversion',
            defaultJobOptions: {
                attempts: 3,
                backoff: { type: 'exponential', delay: 2000 },
                removeOnComplete: true,
            },
        }),
        ConfigModule,
        GotenbergModule,
        PdfModule,
        S3Module,
    ],
    providers: [DocumentConversionProcessor, DocumentConversionService],
    exports: [DocumentConversionService],
})
export class BullmqModule {}
