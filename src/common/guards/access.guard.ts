import { CanActivate, ExecutionContext, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { TokenService } from '../../modules/token/token.service';
import { RoleService } from '../../modules/role/role.service';
import { UserService } from '../../modules/user/user.service';
import { PayloadDTO } from '../../modules/token';
import { RequestUser } from '../types/request-user';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

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
    private logger = new Logger(AccessGuard.name);
    constructor(
        private readonly reflector: Reflector,
        private readonly tokenService: TokenService,
        private readonly roleService: RoleService,
        private readonly userService: UserService,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest<Request>();
        this.logger.debug('Access guard');

        const isPublic = this.reflector.get<boolean>(IS_PUBLIC_KEY, context.getHandler());

        if (isPublic) return true;
        // if (request.url.includes('auth/signIn')) return true;

        if (!request.headers.authorization) throw new UnauthorizedException('Невалидные данные токена');

        if (request.headers.authorization.startsWith('Bearer ')) {
            const token = request.headers.authorization.replace('Bearer ', '');

            if (!token || token === 'undefined') {
                throw new UnauthorizedException('Невалидные данные токена');
            }

            try {
                const payload: PayloadDTO = await this.tokenService.verifyAccessToken(token);

                const userId = payload.id;
                const politicGroups = payload.politicGroups;
                const activeRole = await this.roleService.getRoleWithPermissions(payload.activeRole);

                const user = await this.userService.findOne(userId, {
                    includeRoles: true,
                    includePermissions: true,
                });

                const requestUser: RequestUser = {
                    id: user.id,
                    uidNumber: user.uidNumber,
                    activeRole: activeRole.name,
                    politicGroups,
                    permissions: activeRole.permissions.flatMap((p) => p.name),
                };
                request.user = requestUser;

                if (!user.role.some((r) => r.id == activeRole.id)) {
                    throw new UnauthorizedException('Невалидные данные токена');
                }

                return true;
            } catch (error) {
                this.logger.warn(
                    `Access denied: ${
                        error instanceof Error ? error.message : 'unknown error'
                    }`,
                );
                throw new UnauthorizedException('Невалидные данные токена');
            }
        }

        throw new UnauthorizedException('Невалидные данные токена');
    }
}
