import { Request } from 'express';
import { CanActivate, ExecutionContext, ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { AppRole } from '../../domain/constants';
import { RequestUser } from '../../domain/types/request-user';
import { PermissionResolverService } from '../../application/permission/permission-resolver.service';
import { NodePermissionType } from '@prisma/client';
import Logger, { LoggerKey } from '../../infrastructure/logger/domain/logger';

@Injectable()
export class NodeAdminGuard implements CanActivate {
    constructor(
        @Inject(LoggerKey) private readonly logger: Logger,
        private readonly permissionResolverService: PermissionResolverService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        this.logger.debug('NodeAdminGuard');

        const request = context.switchToHttp().getRequest<Request & { user?: RequestUser }>();

        if (request.user?.activeRole === AppRole.OWNER) return true;

        const nodeId = (request.params.nodeId ?? request.query.nodeId) as string;
        const permissions = await this.permissionResolverService.resolveNodePermissions(request.user?.politicGroups ?? [], nodeId);
        const hasAdmin = permissions.includes(NodePermissionType.ADMIN);

        if (hasAdmin) return true;

        throw new ForbiddenException('Недостаточно прав');
    }
}
