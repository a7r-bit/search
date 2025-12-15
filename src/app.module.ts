import { AuthModule, DirectoryModule, DocumentModule, DocumentVersionModule, RoleModule, UserModule, LikedDirectoryModule, SearchModule } from "./modules";
import { ConfigModule } from "@nestjs/config";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { APP_GUARD } from "@nestjs/core";
import { Module } from "@nestjs/common";
import { AccessGuard, ScopeGuard } from "./common/guards";
import { TokenModule } from "./modules/token";


@Module({
  imports: [DirectoryModule, DocumentModule, DocumentVersionModule, ConfigModule.forRoot({ isGlobal: true }), AuthModule, UserModule, RoleModule, TokenModule, LikedDirectoryModule, SearchModule],
  controllers: [AppController],
  providers: [AppService,
    { provide: APP_GUARD, useClass: AccessGuard },
    { provide: APP_GUARD, useClass: ScopeGuard },
  ],
})
export class AppModule { }
