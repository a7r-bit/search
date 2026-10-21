import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AccessGuard } from './common/guards/access.guard';
import { ScopeGuard } from './common/guards/scope.guard';
import { S3Module } from './infrastructure/s3';
import { EmployeesParserModule } from './infrastructure/employees-parser';
// import { HttpInfrastructureModule } from './infrastructure/http/http.module';
import {
    AuthModule,
    DocumentVersionModule,
    FileProviderModule,
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
import { HttpInfrastructureModule } from './infrastructure/http/http.module';

@Module({
    imports: [
        LoggerModule,
        NodeModule,
        ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
        AuthModule,
        UserModule,
        RoleModule,
        DocumentVersionModule,
        LikedNodeModule,
        PoliticModule,
        EmployeesParserModule,
        S3Module,
        FileProviderModule,
        SyncModule,
        TokenModule,
        ContextModule,
        HttpInfrastructureModule,
        ...(process.env.ENABLE_ADMIN === 'true' ? [adminJsImport] : []),
    ],
    controllers: [AppController],
    providers: [AppService, { provide: APP_GUARD, useClass: AccessGuard }, { provide: APP_GUARD, useClass: ScopeGuard }],
})
export class AppModule {}
