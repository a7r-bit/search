import { Injectable } from '@nestjs/common';
import { PDFParse } from 'pdf-parse';

@Injectable()
export class PdfService {
    async extractTextFromPdfByBuffer(buffer: Buffer): Promise<string> {
        const uint8Array = new Uint8Array(buffer);
        const data = new PDFParse(uint8Array);
        return (await data.getText()).text;
    }
}
