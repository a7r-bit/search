
export class DocumentVersionIndexDto {
    constructor(content: string, createdAt: Date, documentId: string, filename: string, path: string, version: number) {
        this.content = content
        this.createdAt = createdAt
        this.documentId = documentId
        this.fileName = filename
        this.path = path
        this.version = version
    }
    content: string;
    createdAt: Date;
    documentId: string;
    fileName: string;
    path: string;
    version: number;
}