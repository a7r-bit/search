import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { DocumentConversionProcessor } from './document-conversion.processor';
import { DocumentConversionService } from './document-conversion.service';
import { GotenbergModule } from '../gotenberg/gotenberg.module';
import { FileStorageModule } from '../file-storage/file-storage.module';
import { PdfModule } from '../pdf/pdf.module';
import { SearchModule } from '../search';

@Module({
    imports: [
        BullModule.forRoot({
            connection: {
                host: `${process.env.REDIS_HOST}`,
                port: Number(process.env.REDIS_PORT)
            },

        }),
        BullModule.registerQueue({ name: "documentConversion", }),
        GotenbergModule, FileStorageModule, PdfModule, SearchModule
    ],
    providers: [DocumentConversionProcessor, DocumentConversionService],
    exports: [DocumentConversionService],
})
export class BullmqModule { }
