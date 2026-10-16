import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import Strategy from 'passport-ldapauth';
import { ConfigService } from '@nestjs/config';
import Logger, { LoggerKey } from '../../infrastructure/logger/domain/logger';
import { LdapUserPayload } from './ldap.user.payload';
import { LdapConfig } from './config/ldap-config.interface';

function requireEnv<T>(config: ConfigService, key: string): T {
    const value = config.get<T>(key);
    if (value === undefined || value === null) {
        throw new Error(`Environment variable ${key} is required`);
    }
    return value;
}

@Injectable()
export class LdapStrategy extends PassportStrategy(Strategy, 'ldap') {
    constructor(
        @Inject(LoggerKey) private logger: Logger,
        private readonly config: ConfigService,
    ) {
        const ldapConfig: LdapConfig = {
            host: requireEnv<string>(config, 'LDAP_HOST'),
            port: requireEnv<number>(config, 'LDAP_PORT'),
            adminDn: requireEnv<string>(config, 'LDAP_ADMIN_DN'),
            adminPassword: requireEnv<string>(config, 'LDAP_ADMIN_PASSWORD'),
            usersDn: requireEnv<string>(config, 'LDAP_USERS_DN'),
            searchFilter: requireEnv<string>(config, 'LDAP_SEARCH_FILTER'),
            tlsEnabled: config.get<boolean>('LDAP_TLS_ENABLED', false),
        };
        super({
            server: {
                url: `${ldapConfig.tlsEnabled ? 'ldaps:' : 'ldap:'}//${ldapConfig.host}:${ldapConfig.port}`,
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
        const uidNumber = String(user.sAMAccountName ?? user.uid ?? '');
        this.logger.info(`LDAP successful authentication for uidNumber: ${uidNumber}`);
        return { ...user, uidNumber };
    }
}
