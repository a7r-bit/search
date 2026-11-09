/**
 * Классификация неудач LDAP-аутентификации (passport-ldapauth).
 *
 * Стратегия сообщает о неудаче двумя путями:
 * - `fail(challenge, status)` — клиентские проблемы: неверный пароль, неизвестный
 *   пользователь, состояние учётной записи, неверно настроенный searchBase;
 * - `error(err)` — инфраструктурные: сеть/таймаут/неудачный bind администратора.
 */

export type LdapFailureReason =
    | 'missing_credentials'
    | 'bad_credentials'
    | 'account_state'
    | 'bad_search_base'
    | 'ldap_unavailable'
    | 'unknown';

export interface LdapFailure {
    reason: LdapFailureReason;
    /** Сообщение для клиента — безопасно возвращать в ответе */
    message: string;
    /** Детали для лога (пароль никогда не содержит) */
    detail: string;
    /** Инфраструктурный сбой (LDAP недоступен/не настроен) — клиенту 503 */
    infra: boolean;
}

/** Состояния AD (коды 530–775, ConstraintViolation) с сообщениями, по которым пользователь может действовать */
const ACCOUNT_STATE_MESSAGES: Record<string, string> = {
    'Password expired': 'Срок действия пароля истёк',
    'Account disabled': 'Учётная запись отключена',
    'Account expired': 'Срок действия учётной записи истёк',
    'User must reset password': 'Необходимо сбросить пароль',
    'User account locked': 'Учётная запись заблокирована',
    'Not Permitted to login at this time': 'Вход не разрешён в это время',
    'Not permited to logon at this workstation': 'Вход с этого рабочего места не разрешён',
    'Exceeded password retry limit, account locked': 'Превышено число неудачных попыток, учётная запись заблокирована',
};

export function getChallengeMessage(info: unknown): string {
    if (typeof info === 'string') {
        return info;
    }
    if (info && typeof info === 'object' && typeof (info as { message?: unknown }).message === 'string') {
        return (info as { message: string }).message;
    }
    return '';
}

/** Неудача аутентификации (fail-путь passport): credentials/состояние записи/настройка сервера */
export function classifyLdapFailure(info: unknown, status?: number): LdapFailure {
    const challenge = getChallengeMessage(info);

    if (status === 400 || challenge.toLowerCase() === 'missing credentials') {
        return {
            reason: 'missing_credentials',
            message: 'Не указаны логин или пароль',
            detail: challenge || `status=${status}`,
            infra: false,
        };
    }

    // searchBase не существует в LDAP — проблема настройки сервера, а не клиента
    if (challenge.toLowerCase() === 'bad search base') {
        return {
            reason: 'bad_search_base',
            message: 'LDAP временно недоступен, обратитесь к администратору',
            detail: challenge,
            infra: true,
        };
    }

    const accountStateMessage = ACCOUNT_STATE_MESSAGES[challenge];
    if (accountStateMessage) {
        return { reason: 'account_state', message: accountStateMessage, detail: challenge, infra: false };
    }

    // passport-ldapauth намеренно не различает «неверный пароль» и «пользователь не найден»
    // (защита от перечисления учётных записей) — различие остаётся только в логах
    if (challenge.toLowerCase() === 'invalid username/password') {
        return { reason: 'bad_credentials', message: 'Неверный логин или пароль', detail: challenge, infra: false };
    }

    return {
        reason: 'unknown',
        message: 'Не удалось выполнить вход',
        detail: challenge || JSON.stringify(info ?? null),
        infra: false,
    };
}

/** Реальная ошибка (error-путь passport): сеть/таймаут/недоступность LDAP или неверные учётные данные admin bind */
export function classifyLdapError(err: Error): LdapFailure {
    const code = typeof (err as NodeJS.ErrnoException).code === 'string' ? (err as NodeJS.ErrnoException).code : '';
    const detail = [err.name, err.message, code].filter(Boolean).join(': ');
    return {
        reason: 'ldap_unavailable',
        message: 'LDAP временно недоступен, повторите попытку позже',
        detail,
        infra: true,
    };
}
