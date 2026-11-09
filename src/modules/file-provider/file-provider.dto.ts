export interface GetFileUrlRequest {
    documentVersionId: string;
    expiresIn: number;
}

export interface GetFileUrlResponse {
    url: string;
    fileName: string;
    extention: string;
}

export interface GetAccessToFileRequest {
    documentVersionId: string;
    tabNumber: string;
}

export interface GetAccessToFileResponse {
    getAccessToFile: boolean;
}
