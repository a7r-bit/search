import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TokenService } from './token.service';
import { UserModule } from '../user';
import { ConfigModule, ConfigService } from '@nestjs/config';
import type { StringValue } from 'ms';
@Global()
@Module({
  imports: [





    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET', ''),
        signOptions: {
          expiresIn: config.get<StringValue>('JWT_EXPIRES_IN', '1D'),
        },
      }),
    }),
    UserModule

  ],
  providers: [TokenService],
  exports: [TokenService],
})
export class TokenModule { }