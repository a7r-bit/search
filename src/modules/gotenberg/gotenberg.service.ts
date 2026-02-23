import { Injectable } from '@nestjs/common';
import FormData from "form-data"
import axios from 'axios';
import { readFile } from 'fs/promises';
import { basename, join } from 'path';

@Injectable()
export class GotenbergService {

    private readonly baseUrl = process.env.GOTENBERG_URL;
    async convertDocxToPdf(pathToFile: string): Promise<Buffer> {


        const file = await readFile(pathToFile);

        const form = new FormData();
        form.append('files', file, { filename: basename(pathToFile) });

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
