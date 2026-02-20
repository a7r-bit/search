
export class DocumentVersionIndexDto {
    constructor(content: string, createdAt: Date, nodeId: string, filename: string, path: string, version: number) {
        this.content = content
        this.createdAt = createdAt
        this.nodeId = nodeId
        this.fileName = filename
        this.path = path
        this.version = version
    }
    content: string;
    createdAt: Date;
    nodeId: string;
    fileName: string;
    path: string;
    version: number;
}