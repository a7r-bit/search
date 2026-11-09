import { Module } from '@nestjs/common';
import { S3Module } from '../../infrastructure/s3/s3.module';
import { FileProviderController } from './file-provider.controller';
import { FileProviderService } from './file-provider.service';
import { DocumentVersionModule } from '../document-version/document-version.module';
import { NodeModule } from '../node/node.module';
import { PoliticModule } from '../politic/politic.module';

@Module({
    imports: [S3Module, DocumentVersionModule, NodeModule, PoliticModule],
    controllers: [FileProviderController],
    providers: [FileProviderService],
})
export class FileProviderModule {}
