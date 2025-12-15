import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { log } from 'console';
import Strategy from 'passport-ldapauth';

@Injectable()
export class LdapStrategy extends PassportStrategy(Strategy, 'ldap') {
    constructor() {
        super({
            server: {
                url: `ldap://${process.env.LDAP_HOST}:${process.env.LDAP_PORT}`,
                bindDN: `${process.env.LDAP_ADMIN_DN}`,
                bindCredentials: `${process.env.LDAP_ADMIN_PASSWORD}`,
                searchBase: 'ou=users,dc=mycompany,dc=local',
                searchFilter: '(uidNumber={{username}})',
            },
            usernameField: 'username',
            passwordField: 'password',
        });
    }

    async validate(user: any) {


        return user;
    }
}
