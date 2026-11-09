import { classifyLdapError, classifyLdapFailure, getChallengeMessage } from './ldap-failure';

describe('getChallengeMessage', () => {
    it('возвращает message из объекта-челленджа', () => {
        expect(getChallengeMessage({ message: 'Invalid username/password' })).toBe('Invalid username/password');
    });

    it('возвращает строковый челлендж как есть', () => {
        expect(getChallengeMessage('Invalid username/password')).toBe('Invalid username/password');
    });

    it('возвращает пустую строку для прочих значений', () => {
        expect(getChallengeMessage(undefined)).toBe('');
        expect(getChallengeMessage(null)).toBe('');
        expect(getChallengeMessage({})).toBe('');
        expect(getChallengeMessage(42)).toBe('');
    });
});

describe('classifyLdapFailure', () => {
    it('отсутствующие креденшелы (400) → missing_credentials', () => {
        const failure = classifyLdapFailure({ message: 'Missing credentials' }, 400);
        expect(failure.reason).toBe('missing_credentials');
        expect(failure.infra).toBe(false);
    });

    it('неверный пароль и неизвестный пользователь не различаются (bad_credentials, 401)', () => {
        const failure = classifyLdapFailure({ message: 'Invalid username/password' }, 401);
        expect(failure.reason).toBe('bad_credentials');
        expect(failure.infra).toBe(false);
    });

    it('неверный searchBase → bad_search_base (инфраструктура)', () => {
        const failure = classifyLdapFailure({ message: 'Bad search base' }, 401);
        expect(failure.reason).toBe('bad_search_base');
        expect(failure.infra).toBe(true);
    });

    it('состояния AD → account_state с русским сообщением', () => {
        expect(classifyLdapFailure({ message: 'Password expired' }, 401).reason).toBe('account_state');
        expect(classifyLdapFailure({ message: 'Account disabled' }, 401).reason).toBe('account_state');
        expect(classifyLdapFailure({ message: 'Account expired' }, 401).message).toBe('Срок действия учётной записи истёк');
        expect(classifyLdapFailure({ message: 'User account locked' }, 401).message).toBe('Учётная запись заблокирована');
        expect(classifyLdapFailure({ message: 'User must reset password' }, 401).reason).toBe('account_state');
        expect(classifyLdapFailure({ message: 'Not Permitted to login at this time' }, 401).reason).toBe('account_state');
        expect(classifyLdapFailure({ message: 'Not permited to logon at this workstation' }, 401).reason).toBe('account_state');
        expect(classifyLdapFailure({ message: 'Exceeded password retry limit, account locked' }, 401).reason).toBe('account_state');
    });

    it('строковый челлендж обрабатывается так же, как объект', () => {
        expect(classifyLdapFailure('Invalid username/password', 401).reason).toBe('bad_credentials');
    });

    it('неизвестный челлендж → unknown (не инфраструктура)', () => {
        const failure = classifyLdapFailure(undefined);
        expect(failure.reason).toBe('unknown');
        expect(failure.infra).toBe(false);
    });
});

describe('classifyLdapError', () => {
    it('сетевая ошибка → ldap_unavailable, код в detail', () => {
        const err = Object.assign(new Error('connect ECONNREFUSED 10.1.2.3:389'), { code: 'ECONNREFUSED' });
        const failure = classifyLdapError(err);
        expect(failure.reason).toBe('ldap_unavailable');
        expect(failure.infra).toBe(true);
        expect(failure.detail).toContain('ECONNREFUSED');
    });

    it('таймаут → ldap_unavailable, код в detail', () => {
        const err = Object.assign(new Error('ldap search timeout'), { code: 'ETIMEDOUT' });
        const failure = classifyLdapError(err);
        expect(failure.reason).toBe('ldap_unavailable');
        expect(failure.detail).toContain('ETIMEDOUT');
    });

    it('ошибка без кода → detail из name и message', () => {
        const failure = classifyLdapError(new Error('connection closed unexpectedly'));
        expect(failure.reason).toBe('ldap_unavailable');
        expect(failure.detail).toBe('Error: connection closed unexpectedly');
    });
});
