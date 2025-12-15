import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
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
    constructor(private reflector: Reflector) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const requiredScope = this.reflector.get<string>(SCOPE_KEY, context.getHandler());
        if (!requiredScope) return true;

        const permissions = this.reflector.get<string[]>(PERMISSION_KEY, context.getHandler());




        if (this.reflector.get<string>(ROLE_KEY, context.getHandler()).includes("Owner")) {
            return true
        }


        if (!permissions) return false;

        return permissions.includes(requiredScope) ?? false
    }
}
