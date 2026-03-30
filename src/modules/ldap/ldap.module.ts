import { Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import Strategy from 'passport-ldapauth';
import { RequestUser } from '../../common/types/request-user';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class LdapStrategy extends PassportStrategy(Strategy, 'ldap') {
    private readonly logger = new Logger(LdapStrategy.name);
    constructor(private readonly config: ConfigService) {
        super({
            server: {
                url: `ldap://${config.get<string>('LDAP_HOST')}:${config.get<string>('LDAP_PORT')}`, bindDN: process.env.LDAP_ADMIN_DN,
                bindCredentials: config.get<string>("LDAP_ADMIN_PASSWORD", ""),
                searchBase: config.get<string>('LDAP_USERS_DN', ''),
                searchFilter: '(uid={{username}})',
                // searchFilter: '(|(sAMAccountName={{username}})(uid={{username}}))'
            },
            usernameField: 'username',
            passwordField: 'password',
        });
    }

    async validate(user: any) {
        this.logger.log('LDAP successfull authentication for uidNumber: ' + user.uidNumber);
        return user;
    }
}
