import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import Strategy from 'passport-ldapauth';
import { ConfigService } from '@nestjs/config';
import Logger, { LoggerKey } from '../../infrastructure/logger/domain/logger';
import { LdapUserPayload } from './ldap.user.payload';
import { LdapConfig } from './config/ldap-config.interface';

@Injectable()
export class LdapStrategy extends PassportStrategy(Strategy, 'ldap') {
    constructor(
        @Inject(LoggerKey) private logger: Logger,
        private readonly config: ConfigService,
    ) {
        const ldapConfig: LdapConfig = {
            host: config.get<string>('LDAP_HOST'),
            port: config.get<number>('LDAP_PORT'),
            adminDn: config.get<string>('LDAP_ADMIN_DN'),
            adminPassword: config.get<string>('LDAP_ADMIN_PASSWORD'),
            usersDn: config.get<string>('LDAP_USERS_DN'),
            searchFilter: '(|(sAMAccountName={{username}})(uid={{username}}))',
            tlsEnabled: config.get<boolean>('LDAP_TLS_ENABLED', false),
        };
        super({
            server: {
                url: `ldap://${ldapConfig.host}:${ldapConfig.port}`,
                bindDN: ldapConfig.adminDn,
                bindCredentials: ldapConfig.adminPassword,
                searchBase: ldapConfig.usersDn,
                searchFilter: ldapConfig.searchFilter,
            },
            usernameField: 'username',
            passwordField: 'password',
        });
    }

    async validate(user: Record<string, unknown>): Promise<LdapUserPayload> {
        const uidNumber = String(user.sAMAccountName ?? '');
        this.logger.info('LDAP successfull authentication for uidNumber: ' + user.sAMAccountName);
        return { ...user, uidNumber };
    }
}
