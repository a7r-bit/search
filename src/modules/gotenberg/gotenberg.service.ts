import { Injectable } from '@nestjs/common';
import FormData from 'form-data';
import axios from 'axios';
import { readFile } from 'fs/promises';
import { basename } from 'path';
import { ConfigService } from '@nestjs/config';

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
    async convertDocxToPdf(pathToFile: string): Promise<Buffer> {
        const file = await readFile(pathToFile);

        const form = new FormData();
        form.append('files', file, { filename: basename(pathToFile) });

        const res = await axios.post(`${this.host}:${this.port}/forms/libreoffice/convert`, form, {
            headers: form.getHeaders(),
            responseType: 'arraybuffer',
        });

        return res.data;
    }
}
