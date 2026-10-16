import { ConfigService } from '@nestjs/config';
import { LdapStrategy } from './ldap.module';

describe('LdapStrategy', () => {
    const loggerMock = {
        info: jest.fn(),
        error: jest.fn(),
        warn: jest.fn(),
        debug: jest.fn(),
    };

    const buildConfigService = (values: Record<string, unknown>): ConfigService =>
        ({
            get: jest.fn((key: string, defaultValue?: unknown) =>
                Object.prototype.hasOwnProperty.call(values, key) ? values[key] : defaultValue,
            ),
        }) as unknown as ConfigService;

    const fullEnv: Record<string, unknown> = {
        LDAP_HOST: 'ldap.example.com',
        LDAP_PORT: 389,
        LDAP_ADMIN_DN: 'cn=admin,dc=example,dc=com',
        LDAP_ADMIN_PASSWORD: 'super-secret',
        LDAP_USERS_DN: 'ou=users,dc=example,dc=com',
        LDAP_SEARCH_FILTER: '(|(sAMAccountName={{username}})(uid={{username}}))',
        LDAP_TLS_ENABLED: false,
    };

    describe('Конструктор и конфигурация', () => {
        it('создается, когда все env заданы', () => {
            const config = buildConfigService(fullEnv);
            expect(() => new LdapStrategy(loggerMock as any, config)).not.toThrow();
        });
        it('Падение для отсутвии переменной', () => {
            const values = { ...fullEnv };
            delete values.LDAP_HOST;
            const config = buildConfigService(values);
            expect(() => new LdapStrategy(loggerMock as any, config)).toThrow(`Environment variable LDAP_HOST is required`);
        });

        describe.each(['LDAP_HOST', 'LDAP_PORT', 'LDAP_ADMIN_DN', 'LDAP_ADMIN_PASSWORD', 'LDAP_USERS_DN', 'LDAP_SEARCH_FILTER'])(
            'отсутствует %s',
            (missingKey) => {
                it('бросает ошибку старта с правильным сообщением', () => {
                    const values = { ...fullEnv };
                    delete values[missingKey];
                    const config = buildConfigService(values);

                    expect(() => new LdapStrategy(loggerMock as any, config)).toThrow(`Environment variable ${missingKey} is required`);
                });

                it('бросает ошибку, если значение — null', () => {
                    const config = buildConfigService({ ...fullEnv, [missingKey]: null });

                    expect(() => new LdapStrategy(loggerMock as any, config)).toThrow(`Environment variable ${missingKey} is required`);
                });
            },
        );
    });

    describe('Метод validate', () => {
        let strategy: LdapStrategy;

        beforeEach(() => {
            jest.clearAllMocks();
            const config = buildConfigService(fullEnv);
            strategy = new LdapStrategy(loggerMock as any, config);
        });

        it('корректно извлекает uidNumber из sAMAccountName и логирует успех', async () => {
            const ldapUser = {
                sAMAccountName: 'test_user_123',
                givenName: 'Ivan',
                sn: 'Ivanov',
            };

            const result = await strategy.validate(ldapUser);

            expect(result.uidNumber).toBe('test_user_123');
            expect(result.sAMAccountName).toBe('test_user_123');
        });

        it('устанавливает пустую строку в uidNumber, если sAMAccountName отсутствует', async () => {
            const ldapUser = {
                givenName: 'Ivan',
                // sAMAccountName отсутствует
            };

            const result = await strategy.validate(ldapUser);

            expect(result.uidNumber).toBe('');
        });

        it('сохраняет все остальные поля пользователя из LDAP', async () => {
            const ldapUser = {
                sAMAccountName: 'user1',
                mail: 'user1@example.com',
                displayName: 'User One',
                dn: 'cn=user1,ou=users,dc=example,dc=com',
            };

            const result = await strategy.validate(ldapUser);

            expect(result).toMatchObject({
                uidNumber: 'user1',
                mail: 'user1@example.com',
                displayName: 'User One',
                dn: 'cn=user1,ou=users,dc=example,dc=com',
            });
        });
    });
});
