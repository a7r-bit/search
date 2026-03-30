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
        const requiredRole = this.reflector.get<string>(ROLE_KEY, context.getHandler());
        if (!requiredRole || request.user?.activeRole === AppRole.OWNER) return true;

        const isInclude = request.user?.activeRole === requiredRole;
        if (!isInclude) {
            this.logger.log(`Required role "${requiredRole}" is not included in the list of available roles.`);
        }

        return isInclude ? true : false;
    }

}