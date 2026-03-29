import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { LdapStrategy } from '../ldap/ldap.module';
import { UserModule } from '../user/user.module';
import { RoleModule } from '../role';
import { TokenModule } from '../token';
import { PoliticModule } from '../politic/politic.module';
import { EmplayersParserModule } from '../emplayees_parser/emplayees_parser.module';

@Module({
    controllers: [AuthController],
    imports: [UserModule, RoleModule, TokenModule, PoliticModule, EmplayersParserModule],
    providers: [AuthService, LdapStrategy],
})
export class AuthModule {}
