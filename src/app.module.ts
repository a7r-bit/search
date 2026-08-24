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
    FileProviderModule,
    GlobalSearchModule,
    LikedNodeModule,
    NodeModule,
    PoliticModule,
    RoleModule,
    SyncModule,
    TokenModule,
    UserModule,
} from './modules';
import { adminJsImport } from './modules/admin/admin-js.import';
import { LoggerModule } from './infrastructure/logger/infrastructure/winston/nestjs/logger.module';
import { ContextModule } from './infrastructure/context/infrastructure/nestjs/contextModule';


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
        FileProviderModule,
        SyncModule,
        TokenModule,
        ContextModule,
        LoggerModule,
        ...(process.env.ENABLE_ADMIN === 'true' ? [adminJsImport] : []),
    ],
    controllers: [AppController],
    providers: [AppService, { provide: APP_GUARD, useClass: AccessGuard }, { provide: APP_GUARD, useClass: ScopeGuard }],
})
export class AppModule {}
