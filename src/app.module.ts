import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AccessGuard } from './common/guards/access.guard';
import { ScopeGuard } from './common/guards/scope.guard';
import { S3Module } from './infrastructure/s3/s3.module';
import { EmployeesParserModule } from './infrastructure/employees-parser/employees-parser.module';
import { AuthModule } from './modules/auth/auth.module';
import { DocumentVersionModule } from './modules/document-version/document-version.module';
import { FileProviderModule } from './modules/file-provider/file-provider.module';
import { LikedNodeModule } from './modules/liked-node/liked-node.module';
import { NodeModule } from './modules/node/node.module';
import { PoliticModule } from './modules/politic/politic.module';
import { RoleModule } from './modules/role/role.module';
import { SyncModule } from './modules/sync/sync.module';
import { TokenModule } from './modules/token/token.module';
import { UserModule } from './modules/user/user.module';
import { adminJsImport } from './modules/admin/admin-js.import';
import { LoggerModule } from './infrastructure/logger/infrastructure/winston/nestjs/logger.module';
import { ContextModule } from './infrastructure/context/infrastructure/nestjs/contextModule';
import { HttpInfrastructureModule } from './infrastructure/http/http.module';
import { UserProvisioningModule } from './user-provisioning/user-provisioning.module';

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
        UserProvisioningModule,
        ...(process.env.ENABLE_ADMIN === 'true' ? [adminJsImport] : []),
    ],
    controllers: [AppController],
    providers: [AppService, { provide: APP_GUARD, useClass: AccessGuard }, { provide: APP_GUARD, useClass: ScopeGuard }],
})
export class AppModule {}
