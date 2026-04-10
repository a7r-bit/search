import { Module } from "@nestjs/common";
import { S3Module } from "../../infrastructure";
import { FileProviderController } from "./file-provider.controller";
import { FileProviderService } from "./file-provider.service";
import { DocumentVersionModule } from "../document-version";
import { NodeModule } from "../node";
import { PoliticModule } from "../politic";

@Module({
    imports: [S3Module, DocumentVersionModule, NodeModule, PoliticModule],
    controllers: [FileProviderController],
    providers: [FileProviderService],
})
export class FileProviderModule {}