import { CanActivate, ExecutionContext, Injectable, Logger } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ROLE_KEY } from "../decorators";
import { RequestUser } from "../types/request-user";
import { AppRole } from "../constants";

@Injectable()

export class RoleGuard implements CanActivate {
    private readonly logger = new Logger(RoleGuard.name);
    constructor(private reflector: Reflector) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        this.logger.debug('RoleGuard guard');
        const request = context.switchToHttp().getRequest<{ user?: RequestUser }>();
        const requiredRole = this.reflector.getAllAndOverride<string>(ROLE_KEY, [context.getHandler(), context.getClass()]);
        if (!requiredRole) return true;

        const userRole = request.user?.activeRole;
        if (!userRole) {
            this.logger.warn(`Access denied: activeRole is missing. Required role: "${requiredRole}".`);
            return false;
        }

        if (userRole === AppRole.OWNER) return true;

        const normalizedRequiredRole = requiredRole.trim().toLowerCase();
        const normalizedUserRole = userRole.trim().toLowerCase();
        const hasRequiredRole = normalizedUserRole === normalizedRequiredRole;

        if (!hasRequiredRole) {
            this.logger.warn(`Access denied: required role "${requiredRole}", user role "${userRole}".`);
        }

        return hasRequiredRole;
    }

}