import { GrpcMethod } from "@nestjs/microservices";
import { FileProviderService } from "./file-provider.service";
import { Controller } from "@nestjs/common";

interface GetFileUrlRequest {
    documentVersionId: string;
    expiresIn: number;
}

export interface GetFileUrlResponse {
    url: string;
    fileName: string;
    extention: string;
}

export interface GetAccessToFileRequest{
    documentVersionId: string;
    tabNumber: string;
}

export interface GetAccessToFileResponse{
    getAccessToFile: boolean;
}

@Controller('file-provider')
export class FileProviderController {
    constructor(private readonly fileProviderService: FileProviderService) {}

    @GrpcMethod('FileProviderService', 'getFileUrl')
    async getFileUrl(data: GetFileUrlRequest): Promise<GetFileUrlResponse> {
        const {documentVersionId, expiresIn} = data;
        const response = await this.fileProviderService.getFileUrl(documentVersionId, expiresIn);
        return response
    }
    @GrpcMethod('FileProviderService', 'getAccessToFile')
    async getAccessToFile(data: GetAccessToFileRequest): Promise<GetAccessToFileResponse> {
        const {documentVersionId, tabNumber} = data;
        const response = await this.fileProviderService.getAccessToFile(documentVersionId, tabNumber);
        return {getAccessToFile: response}
    }
}