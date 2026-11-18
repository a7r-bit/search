import { CanActivate, ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLE_KEY } from '../decorators/role.decorator';
import { RequestUser } from '../../domain/types/request-user';
import { AppRole } from '../../domain/constants';
import Logger, { LoggerKey } from '../../infrastructure/logger/domain/logger';

@Injectable()
export class RoleGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        @Inject(LoggerKey) private readonly logger: Logger,
    ) {}

    canActivate(context: ExecutionContext): boolean {
        this.logger.debug('RoleGuard guard');
        const request = context.switchToHttp().getRequest<{ user?: RequestUser }>();
        const requiredRole = this.reflector.getAllAndOverride<string>(ROLE_KEY, [context.getHandler(), context.getClass()]);
        if (!requiredRole) return true;

        const userRole = request.user?.activeRole;
        if (!userRole) {
            this.logger.warn(`Access denied: activeRole is missing. Required role: "${requiredRole}".`);
            return false;
        }

        if (userRole === (AppRole.OWNER as string)) return true;

        const normalizedRequiredRole = requiredRole.trim().toLowerCase();
        const normalizedUserRole = userRole.trim().toLowerCase();
        const hasRequiredRole = normalizedUserRole === normalizedRequiredRole;

        if (!hasRequiredRole) {
            this.logger.warn(`Access denied: required role "${requiredRole}", user role "${userRole}".`);
        }

        return hasRequiredRole;
    }
}
