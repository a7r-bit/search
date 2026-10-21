import { Injectable } from '@nestjs/common';
import FormData from 'form-data';
import path from 'path';
import { GotenbergClient } from '../../infrastructure/http/clients/gotenberg.client';

@Injectable()
export class GotenbergService {
    constructor(private readonly gotenbergClient: GotenbergClient) {}

    async convertDocxToPdf(file: Buffer, originalFileName = 'document.docx'): Promise<Buffer> {
        const form = new FormData();
        const extension = path.extname(originalFileName).toLowerCase();
        const contentType =
            extension === '.doc'
                ? 'application/msword'
                : extension === '.docx'
                  ? 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
                  : 'application/octet-stream';

        form.append('files', file, {
            filename: originalFileName,
            contentType,
        });

        return this.gotenbergClient.convertLibreOffice(form);
    }
}
