import { Module } from '@nestjs/common';
import { PdfService } from './application/pdf.service';
import { PdfController } from './presentation/pdf.controller';

@Module({
    controllers: [PdfController],
    providers: [PdfService],
    exports: [PdfService],
})
export class PdfModule {}
