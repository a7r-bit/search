import { Request } from 'express';
import { CanActivate, ExecutionContext, ForbiddenException, Injectable, Logger } from '@nestjs/common';
import { AppRole } from '../constants';
import { RequestUser } from '../types/request-user';
import { PoliticService } from '../../modules/politic/politic.service';

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
        private readonly policeService: PoliticService,
    ) { }
    async canActivate(context: ExecutionContext): Promise<boolean> {
        Logger.debug('CheckGroupPolitic guard', CheckGroupPolitic.name);

        const request = context.switchToHttp().getRequest<Request & { user?: RequestUser }>();

        if (request.user?.activeRole === AppRole.OWNER) return true;

        const matches = await this.policeService.checkUserToNodeAccess(request.user['politicGroups'], request.query.parentId as string);

        if (matches) return true;

        throw new ForbiddenException(`Доступ отсутствует`);
    }
}
