import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TokenService } from './application/token.service';
import { TokenController } from './presentation/token.controller';
@Global()
@Module({
    imports: [JwtModule.register({})],
    controllers: [TokenController],
    providers: [TokenService],
    exports: [TokenService],
})
export class TokenModule {}
