import { Request } from 'express';
import { CanActivate, ExecutionContext, ForbiddenException, Injectable, Logger } from '@nestjs/common';
import { AppRole } from '../constants';
import { RequestUser } from '../types/request-user';
import { PoliticService } from '../../modules/politic/politic.service';

@Injectable()
export class NodeAdminGuard implements CanActivate {
    private readonly logger = new Logger(NodeAdminGuard.name);

    constructor(private readonly politicService: PoliticService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        this.logger.debug('NodeAdminGuard');

        const request = context.switchToHttp().getRequest<Request & { user?: RequestUser }>();

        if (request.user?.activeRole === AppRole.OWNER) return true;

        const nodeId = (request.params.nodeId ?? request.query.nodeId) as string;

        const hasAdmin = await this.politicService.hasAdminOnNode(request.user?.politicGroups ?? [], nodeId);

        if (hasAdmin) return true;

        throw new ForbiddenException('Недостаточно прав');
    }
}
