import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import FormData from 'form-data';

@Injectable()
export class GotenbergClient {
    private readonly host: string;
    private readonly port: number;

    constructor(private readonly config: ConfigService) {
        this.host = this.config.get<string>('GOTENBERG_HOST');
        this.port = this.config.get<number>('GOTENBERG_PORT');

        if (!this.host || !this.port) {
            throw new Error('GOTENBERG_HOST and GOTENBERG_PORT must be defined in the environment variables');
        }
    }

    async convertLibreOffice(form: FormData): Promise<Buffer> {
        const response = await axios.post(`http://${this.host}:${this.port}/forms/libreoffice/convert`, form, {
            headers: {
                ...form.getHeaders(),
            },
            responseType: 'arraybuffer',
        });
        return Buffer.from(response.data);
    }
}
