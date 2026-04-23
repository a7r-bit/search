import { CanActivate, ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AppRole } from '../constants';
import { SCOPE_KEY } from '../decorators';
import { RequestUser } from '../types/request-user';
/*
 *   Проверка доступа к контроллеру
 *   при наличии декоратора Scope у
 *   маршрута контроллера.
 *   Пример: @Scope("client:read"), @Scope("client:write"), @Scope("client:delete")
 *
 */
@Injectable()
export class ScopeGuard implements CanActivate {
    private readonly logger = new Logger(ScopeGuard.name);
    constructor(private reflector: Reflector) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest<{ user?: RequestUser }>();

        const requiredScope = this.reflector.get<string>(SCOPE_KEY, context.getHandler());
        if (!requiredScope) return true;
        const permissions = request.user?.permissions ?? [];

        if (request.user?.activeRole === AppRole.OWNER) {
            return true;
        }

        return permissions.includes(requiredScope);
    }
}
