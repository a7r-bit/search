import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AccessGuard } from './common/guards/access.guard';
import { ScopeGuard } from './common/guards/scope.guard';
import { S3Module } from './infrastructure/s3';
import { EmployeesParserModule } from './infrastructure/employees-parser';
import {
    AuthModule,
    DocumentVersionModule,
    GlobalSearchModule,
    LikedNodeModule,
    NodeModule,
    PoliticModule,
    RoleModule,
    TokenModule,
    UserModule,
} from './modules';

@Module({
    imports: [
        NodeModule,
        ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
        AuthModule,
        UserModule,
        RoleModule,
        TokenModule,
        DocumentVersionModule,
        LikedNodeModule,
        GlobalSearchModule,
        PoliticModule,
        EmployeesParserModule,
        S3Module,
    ],
    controllers: [AppController],
    providers: [AppService, { provide: APP_GUARD, useClass: AccessGuard }, { provide: APP_GUARD, useClass: ScopeGuard }],
})
export class AppModule { }
