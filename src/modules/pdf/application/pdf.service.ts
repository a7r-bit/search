import { Injectable } from '@nestjs/common';
import pdf from 'pdf-parse';

@Injectable()
export class PdfService {
    async extractTextFromPdfByBuffer(buffer: Buffer): Promise<string> {
        const data = await pdf(buffer);
        return data.text;
    }
}
