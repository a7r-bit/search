export const FILE_STORAGE = Symbol();

export interface FileStorage {
    uploadFile(file: Express.Multer.File, prefix?: string);
    deleteFile(key: string): Promise<{ message: string }>;
    uploadBufferAsPdf(buffer: Buffer, prefix: string, extension?: string, contentType?: string): Promise<{ key: string }>;
    getFileBuffer(key: string): Promise<Buffer>;
    getFileUrl(key: string, expiresIn?: number): Promise<{ url: string }>;
}
