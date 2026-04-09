import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { LdapStrategy } from '../ldap';
import { UserModule } from '../user';
import { RoleModule } from '../role';
import { TokenModule } from '../token';
import { PoliticModule } from '../politic';
import { EmplayersParserModule } from '../emplayees_parser';

@Module({
    controllers: [AuthController],
    imports: [UserModule, RoleModule, TokenModule, PoliticModule, EmplayersParserModule],
    providers: [AuthService, LdapStrategy],
})
export class AuthModule { }
