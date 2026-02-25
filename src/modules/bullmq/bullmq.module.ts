import { BullModule } from '@nestjs/bullmq';
import { Logger, Module } from '@nestjs/common';
import { DocumentConversionProcessor } from './document-conversion.processor';
import { DocumentConversionService } from './document-conversion.service';
import { GotenbergModule } from '../gotenberg/gotenberg.module';
import { FileStorageModule } from '../file-storage/file-storage.module';
import { PdfModule } from '../pdf/pdf.module';
import { SearchModule } from '../search';
import { ConfigModule, ConfigService } from '@nestjs/config';

Logger.log(`BullMQ → Redis host: ${process.env.REDIS_HOST}, port: ${process.env.REDIS_PORT}`, 'BullmqModule');

@Module({
    imports: [
        ConfigModule,
        BullModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (config: ConfigService) => {

                const host = config.get<string>('REDIS_HOST');
                const port = config.get<number>('REDIS_PORT');


                return {
                    connection: {
                        host: `${host}`,
                        port: port
                    },
                }

            },



        }),
        BullModule.registerQueue({ name: "documentConversion", }),
        GotenbergModule, FileStorageModule, PdfModule, SearchModule
    ],
    providers: [DocumentConversionProcessor, DocumentConversionService],
    exports: [DocumentConversionService],
})
export class BullmqModule { }
