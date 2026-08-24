import { Global, Module } from "@nestjs/common";
import { randomUUID } from "crypto";
import { Request } from "express";
import { ClsModule } from "nestjs-cls";
import { ContextStorageServiceKey } from "../../domain/interfaces/contextStorageService";
import { NestjsClsContextStorageService } from "../nestjs-cls/nestjsClsContextStorageService";

@Global()
@Module(    {
    imports:[
        ClsModule.forRoot({
            global:true,
            middleware:{
                mount:true,
                generateId:true,
                idGenerator:(req:Request)=> (req.headers['x-correlation-id']|| randomUUID()) as string
            }
        }),
    ],
    controllers:[],
    providers:[
        {
            provide: ContextStorageServiceKey,
            useClass: NestjsClsContextStorageService,
        },

    ],
    exports: [ContextStorageServiceKey],

})
export class ContextModule {}
