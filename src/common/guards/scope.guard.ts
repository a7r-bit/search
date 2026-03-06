import { CanActivate, ExecutionContext, Injectable, Logger } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { PERMISSION_KEY, ROLE_KEY, SCOPE_KEY } from "../decorators";
/*
*   Проверка доступа к контроллеру
*   при наличии декоратора Scope у 
*   маршрута контроллера. 
*   Пример: @Scope("client:read"), @Scope("client:write"), @Scope("client:delete") 
* 
*/
@Injectable()
export class ScopeGuard implements CanActivate {
    private readonly logger = new Logger(ScopeGuard.name)
    constructor(private reflector: Reflector) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        this.logger.debug("ScopeGuard guard")

        const requiredScope = this.reflector.get<string>(SCOPE_KEY, context.getHandler());
        if (!requiredScope) return true;

        const permissions = this.reflector.get<string[]>(PERMISSION_KEY, context.getHandler());





        const roles = this.reflector.get<string[]>(ROLE_KEY, context.getHandler());

        if (roles?.includes("Owner")) {
            return true;
        }


        if (!permissions) return false;

        return permissions.includes(requiredScope) ?? false
    }
}
