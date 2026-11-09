import { Module } from '@nestjs/common';
import { AuthService } from './application/auth.service';
import { AuthController } from './presentation/auth.controller';
import { LdapStrategy } from '../ldap/ldap.module';
import { UserModule } from '../user/user.module';
import { RoleModule } from '../role/role.module';
import { TokenModule } from '../token/token.module';
import { PoliticModule } from '../politic/politic.module';
import { EmployeesParserModule } from '../employees-parser/employees-parser.module';
import { UserProvisioningModule } from '../user-provisioning/user-provisioning.module';

@Module({
    controllers: [AuthController],
    imports: [UserModule, RoleModule, TokenModule, PoliticModule, EmployeesParserModule, UserProvisioningModule],
    providers: [AuthService, LdapStrategy],
})
export class AuthModule {}
