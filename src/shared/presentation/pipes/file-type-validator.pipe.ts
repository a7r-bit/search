import { FileValidator } from '@nestjs/common';
import { IFile } from '@nestjs/common/pipes/file/interfaces';

export class CustomFileTypeValidator extends FileValidator<Record<string, any>, IFile> {
    constructor(private readonly allowedTypes: RegExp) {
        super({});
    }

    async isValid(file?: IFile): Promise<boolean> {
        if (!file || !file.mimetype) return false;
        return this.allowedTypes.test(file.mimetype);
    }

    buildErrorMessage(file?: IFile): string {
        return `Формат файла "${file?.mimetype}" не поддерживается. Разрешены: PDF, DOC, DOCX.`;
    }
}
