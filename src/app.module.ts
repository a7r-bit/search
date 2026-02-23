import { ConfigModule } from "@nestjs/config";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { APP_GUARD } from "@nestjs/core";
import { Module } from "@nestjs/common";
import { TokenModule } from "./modules/token";
import { NodeModule } from "./modules/node";
import { AuthModule } from "./modules/auth/auth.module";
import { UserModule } from "./modules/user/user.module";
import { RoleModule } from "./modules/role/role.module";
import { DocumentVersionModule } from "./modules/document-version/document-version.module";
import { LikedNodeModule } from "./modules/liked-node/liked-node.module";
import { GlobalSearchModule } from "./modules/global-search/global-search.module";
import { ImportModule } from "./modules/import/import.module";
import { AccessGuard } from "./common/guards/access.guard";
import { ScopeGuard } from "./common/guards/scope.guard";



@Module({
  imports: [NodeModule, ConfigModule.forRoot({ isGlobal: true }), AuthModule, UserModule, RoleModule, TokenModule, DocumentVersionModule, LikedNodeModule, GlobalSearchModule, ImportModule],
  controllers: [AppController],
  providers: [AppService,
    { provide: APP_GUARD, useClass: AccessGuard },
    { provide: APP_GUARD, useClass: ScopeGuard },
  ],
})
export class AppModule { }
