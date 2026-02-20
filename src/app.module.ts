import { AuthModule, RoleModule, UserModule, SearchModule, DocumentVersionModule, LikedNodeModule, GlobalSearchModule, ImportModule } from "./modules";
import { ConfigModule } from "@nestjs/config";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { APP_GUARD } from "@nestjs/core";
import { Module } from "@nestjs/common";
import { AccessGuard, ScopeGuard } from "./common/guards";
import { TokenModule } from "./modules/token";
import { NodeModule } from "./modules/node";



@Module({
  imports: [NodeModule, ConfigModule.forRoot({ isGlobal: true }), AuthModule, UserModule, RoleModule, TokenModule, DocumentVersionModule, LikedNodeModule, GlobalSearchModule, ImportModule],
  controllers: [AppController],
  providers: [AppService,
    { provide: APP_GUARD, useClass: AccessGuard },
    { provide: APP_GUARD, useClass: ScopeGuard },
  ],
})
export class AppModule { }
