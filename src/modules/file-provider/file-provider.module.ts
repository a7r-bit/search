import { Module } from '@nestjs/common';
import { S3Module } from '../../shared/infrastructure/s3/s3.module';
import { FileProviderController } from './presentation/file-provider.controller';
import { FileProviderService } from './application/file-provider.service';
import { DocumentVersionModule } from '../document-version/document-version.module';
import { NodeModule } from '../node/node.module';
import { PoliticModule } from '../politic/politic.module';

@Module({
    imports: [S3Module, DocumentVersionModule, NodeModule, PoliticModule],
    controllers: [FileProviderController],
    providers: [FileProviderService],
})
export class FileProviderModule {}
