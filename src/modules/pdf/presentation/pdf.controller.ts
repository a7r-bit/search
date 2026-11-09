import { Controller } from '@nestjs/common';
import { PdfService } from '../application/pdf.service';

@Controller('pdf')
export class PdfController {
    constructor(private readonly pdfService: PdfService) {}
}
