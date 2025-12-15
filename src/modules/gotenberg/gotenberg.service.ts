import { Injectable } from '@nestjs/common';
import FormData from "form-data"
import axios from 'axios';
import { readFile } from 'fs/promises';
import { basename, join } from 'path';

@Injectable()
export class GotenbergService {

    private readonly baseUrl = process.env.GOTENBERG_URL || 'http://localhost:3001';
    async convertDocxToPdf(pathToFile: string): Promise<Buffer> {

        const globalPath = join(".", pathToFile);

        const file = await readFile(globalPath);

        const form = new FormData();
        form.append('files', file, { filename: basename(globalPath) });

        const res = await axios.post(
            `${this.baseUrl}/forms/libreoffice/convert`,
            form,
            {
                headers: form.getHeaders(),
                responseType: 'arraybuffer',
            },

        )


        return res.data


    }
}
