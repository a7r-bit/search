import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TokenService } from './token.service';
import { UserModule } from '../user';
@Global()
@Module({
  imports: [
    JwtModule.register({
      secret: process.env.ACCESS_SECRET_KEY,
      signOptions: { expiresIn: '7d' },
    }

    ),
    UserModule

  ],
  providers: [TokenService],
  exports: [TokenService],
})
export class TokenModule { }