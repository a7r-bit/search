import { Injectable } from '@nestjs/common';
import { promises as fs } from 'fs';
import * as path from 'path';
@Injectable()
export class FileStorageService {
    async saveFileToDisk(file: Express.Multer.File, directoryToSave: string): Promise<string> {
        const fileName = `${Date.now()}${path.extname(file.originalname)}`;
        const filePath = path.join(directoryToSave, fileName);
        await fs.writeFile(filePath, file.buffer);
        return filePath;
    }

    async saveGeneratedFile(file: Buffer, oldFilePath: string): Promise<string> {
        const outputFilePath = path.join('uploads', 'converted', `${path.basename(oldFilePath, path.extname(oldFilePath))}.pdf`);
        await fs.writeFile(outputFilePath, file);
        return outputFilePath;
    }

    async deleteFileFromDisk(path: string): Promise<void> {
        try {
            await fs.rm(path, { force: true });
        } catch (error) {
            if (error.code !== 'ENOENT') {
                throw error;
            }
        }
    }

    async convertOriginalName(fileName: string): Promise<string> {
        const buffer = Buffer.from(fileName, 'latin1');

        return buffer.toString();
    }
}
