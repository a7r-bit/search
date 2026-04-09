import { Injectable } from '@nestjs/common';
import FormData from 'form-data';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import path from 'path';

@Injectable()
export class GotenbergService {
    private readonly host: string;
    private readonly port: string;
    constructor(private readonly config: ConfigService) {
        this.host = this.config.get<string>('GOTENBERG_HOST', '');
        this.port = this.config.get<string>('GOTENBERG_PORT', '');
        if (!this.host || !this.port) {
            throw new Error('GOTENBERG_HOST and GOTENBERG_PORT must be configured');
        }
    }
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

        const res = await axios.post(`http://${this.host}:${this.port}/forms/libreoffice/convert`, form, {
            headers: form.getHeaders(),
            responseType: 'arraybuffer',
        });

        return res.data;
    }
}
