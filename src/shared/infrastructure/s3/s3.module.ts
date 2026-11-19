import { Module } from '@nestjs/common';
import { S3Controller } from './s3.controller';
import { S3Service } from './s3.service';
import { FILE_STORAGE } from '../../domain/interfaces/file-storage.interface';

@Module({
    controllers: [S3Controller],
    providers: [S3Service, { provide: FILE_STORAGE, useExisting: S3Service }],
    exports: [S3Service, FILE_STORAGE],
})
export class S3Module {}
