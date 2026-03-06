import { Request } from "express";
import { CanActivate, ExecutionContext, ForbiddenException, Injectable, Logger } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ROLE_KEY } from "../decorators";
import { PoliticService } from "../../modules/politic/politic.service";

/*
    Проверка наличия у пользователя политик 
    необходимых для получения доступа к Node.
    Если политик у Node не было найдено,
    то рекурсивно проверяется их наличие у 
    родителя до момента нахождения в корне.
    
    Если политик нашлись, то возвращается true.
    Иначе возвращается false
*/

@Injectable()
export class CheckGroupPolitic implements CanActivate {
    constructor(
        private readonly reflector: Reflector,
        private readonly policeService: PoliticService,

    ) { }
    async canActivate(context: ExecutionContext): Promise<boolean> {
        Logger.debug("CheckGroupPolitic guard", CheckGroupPolitic.name)

        const request = context.switchToHttp().getRequest<Request>();
        const roles = this.reflector.get<string[]>(ROLE_KEY, context.getHandler())

        if (roles.includes('Owner')) return true

        const matches = await this.policeService.checkUserToNodeAccess(request.user['politicGroups'], request.query.parentId as string,)

        if (matches) return true;

        throw new ForbiddenException(`Доступ отсутствует`);
    }

}