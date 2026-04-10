import { BadRequestException, Injectable, Logger, NotFoundException } from "@nestjs/common";
import { S3Service } from "../../infrastructure/s3/s3.service";
import { RpcException } from "@nestjs/microservices";
import { status } from "@grpc/grpc-js";
import { DocumentVersionService } from "../document-version/document-version.service";
import { GetFileUrlResponse } from "./file-provider.controller";
import { NodeService } from "../node";
import { PoliticService } from "../politic";
import { isUUID } from "class-validator";

@Injectable()
export class FileProviderService {
    constructor(
        private readonly s3Service: S3Service,
        private readonly documentVersionService: DocumentVersionService,
        private readonly nodeService: NodeService,
        private readonly politicService: PoliticService) {}

    async getFileUrl(documentVersionId:string, expiresIn:number = 3600):Promise<GetFileUrlResponse> {
     try{
         const documentVersion = await this.documentVersionService.findOneById(documentVersionId);
         Logger.log(documentVersion);
         if(!documentVersion.mediaFile){
            throw new RpcException({
                code: status.NOT_FOUND,
                message: 'Media file not found',
            });
         }
         const {url} = await this.s3Service.getFileUrl(documentVersion.mediaFile.fileUrl, expiresIn);
         return {url, fileName: documentVersion.mediaFile.fileName, extention: documentVersion.mediaFile.extention};
     } catch(error){
        throw new RpcException({
            code: status.INTERNAL,
            message: 'Failed to get file URL',
            details: error instanceof Error ? error.message : 'Unknown error',
        })
     }
    }

    async getAccessToFile(documentVersionId: string, tabNumber: string) {
        try {
            if (!isUUID(documentVersionId)) {
               throw new RpcException({
                code: status.INVALID_ARGUMENT,
                message: 'Document version ID is invalid',
               })
            }
            if (!tabNumber?.trim()) {
                throw new RpcException({
                    code: status.INVALID_ARGUMENT,
                    message: 'Tab number is required',
                });
            }

            const documentVersion = await this.documentVersionService.findOneById(documentVersionId);
            const node = await this.nodeService.findById(documentVersion.nodeId);
            const userPoliticGroups = await this.politicService.getPoliticsByTabNumber(tabNumber);
            const hasAccess = await this.politicService.checkUserToNodeAccess(
                userPoliticGroups.map((group) => group.id),
                node.id,
            );

            return hasAccess;
        } catch (error) {
            switch (true) {
                case error instanceof RpcException:
                    throw error;
                case error instanceof BadRequestException:
                    throw new RpcException({
                        code: status.INVALID_ARGUMENT,
                        message: 'Invalid getAccessToFile request',
                        details: error.message,
                    });
                case error instanceof NotFoundException:
                    throw new RpcException({
                        code: status.NOT_FOUND,
                        message: 'Requested entity not found',
                        details: error.message,
                    });
                default:
                    throw new RpcException({
                        code: status.INTERNAL,
                        message: 'Failed to get access to file',
                        details: error instanceof Error ? error.message : 'Unknown error',
                    });
            }
        }
    }
    }