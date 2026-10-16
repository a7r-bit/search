import {
    BadRequestException,
    ExecutionContext,
    Inject,
    Injectable,
    ServiceUnavailableException,
    UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import Logger, { LoggerKey } from '../../infrastructure/logger/domain/logger';
import { classifyLdapError, classifyLdapFailure, LdapFailure } from '../../modules/ldap/ldap-failure';

/**
 * Гвард LDAP-аутентификации с разделением видов неудач:
 * - нет логина/пароля в запросе            → 400
 * - неверный пароль / пользователь не найден / состояние учётной записи → 401
 * - LDAP недоступен (сеть/таймаут) или searchBase настроен неверно      → 503
 *
 * Все неудачи логируются через logger.warn с указанием причины;
 * пароль в логи не попадает (из запроса читается только username).
 */
@Injectable()
export class LdapAuthGuard extends AuthGuard('ldap') {
    constructor(@Inject(LoggerKey) private readonly logger: Logger) {
        super();
    }

    override handleRequest<TUser = unknown>(err: unknown, user: unknown, info: unknown, context: ExecutionContext, status?: number): TUser {
        if (!err && user) {
            return user as TUser;
        }

        const failure = err instanceof Error ? classifyLdapError(err) : classifyLdapFailure(info, status);
        this.logFailure(context, failure);

        if (failure.infra) {
            throw new ServiceUnavailableException(failure.message);
        }
        if (failure.reason === 'missing_credentials') {
            throw new BadRequestException(failure.message);
        }
        throw new UnauthorizedException(failure.message);
    }

    private logFailure(context: ExecutionContext, failure: LdapFailure): void {
        const request = context.switchToHttp().getRequest<{ body?: { username?: unknown } }>();
        const username =
            typeof request.body?.username === 'string' && request.body.username.trim() !== '' ? request.body.username : 'unknown';

        this.logger.warn(`LDAP login failed: reason=${failure.reason} user=${username}`, {
            sourceClass: LdapAuthGuard.name,
            props: { reason: failure.reason, detail: failure.detail },
        });
    }
}
