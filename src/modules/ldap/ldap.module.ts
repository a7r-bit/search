import { Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import Strategy from 'passport-ldapauth';
import { RequestUser } from '../../common/types/request-user';

@Injectable()
export class LdapStrategy extends PassportStrategy(Strategy, 'ldap') {
    private readonly logger = new Logger(LdapStrategy.name);
    constructor() {
        super({
            server: {
                url: `ldap://${process.env.LDAP_HOST}:${process.env.LDAP_PORT}`,
                bindDN: process.env.LDAP_ADMIN_DN,
                bindCredentials: process.env.LDAP_ADMIN_PASSWORD,
                searchBase: process.env.LDAP_USERS_DN,
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
