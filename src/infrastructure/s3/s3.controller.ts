import { Controller, Delete, Get, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { S3Service } from './s3.service';

@Controller('s3')
export class S3Controller {
    constructor(private readonly s3Service: S3Service) {}

    @Get('checkFileExists')
    async checkFileExists(@Query('key') key: string) {
        return this.s3Service.checkFileExists(key);
    }

    @Post('uploadFile')
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(@UploadedFile() file: Express.Multer.File) {
        return this.s3Service.uploadFile(file, 'original');
    }

    @Get('getFile')
    async getFile(@Query('key') key: string) {
        return this.s3Service.getFileUrl(key);
    }

    @Delete('deleteFile')
    async deleteFile(@Query('key') key: string) {
        return this.s3Service.deleteFile(key);
    }
}



