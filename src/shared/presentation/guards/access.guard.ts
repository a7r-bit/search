import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { PayloadDTO } from '../../../modules/token/presentation/dto/payload.dto';
import { RequestUser } from '../../domain/types/request-user';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import ContextStorageService, { ContextStorageServiceKey } from '../../infrastructure/context/domain/interfaces/contextStorageService';
import Logger, { LoggerKey } from '../../infrastructure/logger/domain/logger';
import { TOKEN_VERIFIER, TokenVerifier } from '../../domain/interfaces/token-verifier.interface';
import { ROLE_RESOLVER, RoleResolver } from '../../domain/interfaces/role-resolver.interface';
import { USER_PROVIDER, UserProvider } from '../../domain/interfaces/user-provider.interface';

/*
 *   Проверка токена при обращении к серверу и установка роли,
 *   id пользователя и разрешений в метаданные.
 *   Прокидывает id и activeRole пользака дальше в req
 *
 *   ROLE_KEY - роль пользователя полученная из токена
 *   и прокинутая далее в контроллер через request.user
 *
 *   PERMISSION_KEY - разрешения пользователя полученные из токена
 *   вида ["client:write", "client:list", "client:read", "client:delete"]
 *
 *   USER_ID_KEY - id пользователя полученная из токена
 *   и прокинутая далее в контроллер через request.user
 *
 */
@Injectable()
export class AccessGuard implements CanActivate {
    constructor(
        @Inject(LoggerKey) private readonly logger: Logger,
        @Inject(TOKEN_VERIFIER) private readonly tokenService: TokenVerifier,
        @Inject(ROLE_RESOLVER) private readonly roleService: RoleResolver,
        @Inject(USER_PROVIDER) private readonly userService: UserProvider,
        @Inject(ContextStorageServiceKey) private readonly contextStorageService: ContextStorageService,
        private readonly reflector: Reflector,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest<Request>();

        const isPublic = this.reflector.get<boolean>(IS_PUBLIC_KEY, context.getHandler());

        if (isPublic) return true;

        if (!request.headers.authorization) throw new UnauthorizedException('Невалидные данные токена');

        if (request.headers.authorization.startsWith('Bearer ')) {
            const token = request.headers.authorization.replace('Bearer ', '');

            if (!token || token === 'undefined') {
                throw new UnauthorizedException('Невалидные данные токена');
            }

            try {
                const payload = await this.tokenService.verifyAccessToken(token);

                const userId = payload.id;
                const politicGroups = payload.politicGroups;
                const activeRole = await this.roleService.getRoleWithPermissions(payload.activeRole);

                const user = await this.userService.findOne(userId);

                const requestUser: RequestUser = {
                    id: user.id,
                    uidNumber: user.uidNumber,
                    activeRole: activeRole.name,
                    politicGroups,
                    permissions: activeRole.permissions.flatMap((p) => p.name),
                };
                request.user = requestUser;
                this.contextStorageService.set('user', {
                    id: requestUser.id,
                    uidNumber: requestUser.uidNumber,
                    activeRole: requestUser.activeRole,
                });

                const userRoles = await this.roleService.getRoleByUserId(userId);

                if (!userRoles.some((r) => r.id == activeRole.id)) {
                    throw new UnauthorizedException('Невалидные данные токена');
                }

                return true;
            } catch (error) {
                this.logger.warn(`Access denied: ${error instanceof Error ? error.message : 'unknown error'}`);
                throw new UnauthorizedException('Невалидные данные токена');
            }
        }

        throw new UnauthorizedException('Невалидные данные токена');
    }
}
