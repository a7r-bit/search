import { BadRequestException, ForbiddenException, Injectable, Logger } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { RoleService } from '../role';
import { PayloadDTO, TokenService } from '../token';

@Injectable()
export class AuthService {
    private readonly logger = new Logger(AuthService.name);

    constructor(
        private readonly userService: UserService,
        private readonly roleService: RoleService,
        private readonly tokenService: TokenService
    ) { }
    async signIn(req: any) {

        const reqUser = req.user

        const roles = await this.roleService.mapLdapGroupsToRoles(reqUser.groups)

        let user = await this.userService.findByUidNumber(reqUser.uidNumber)



        if (user) {
            const equal = await this.userService.isEquals(user, reqUser);

            if (!equal) {
                user = await this.userService.update(user.id, {
                    firstName: reqUser.givenName,
                    middleName: reqUser.sn,
                    groups: reqUser.groups,
                    roles: roles
                },)
            }
        } else {
            user = await this.userService.create({
                firstName: reqUser.givenName,
                middleName: reqUser.sn,
                uidNumber: reqUser.uidNumber,
                groups: reqUser.groups,
                roles: roles
            });
        }

        const payload: PayloadDTO = { id: user.id, activeRole: roles[0]?.name }
        this.logger.warn("Вход в программу", payload)


        const tokens = await this.tokenService.generateTokens(payload)

        return {
            tokens: {
                access_token: tokens.access_token,
                refresh_token: tokens.refresh_token,
            },
            user: {
                id: user.id,
                uidNumber: user.uidNumber,
                firstName: user.firstName,
                middleName: user.middleName,
                activeRole: roles[0]?.name,
                roles: roles.map(r => r.name),
            },
        };
    }

    async switchRole(req: any, roleName: string) {

        if (!req.user) {
            throw new BadRequestException("Пользователь не найден");
        }
        console.log(req.user);

        const user = await this.userService.findOne(req.user.id, { includeRoles: true })

        const requiredRole = await this.roleService.getRoleByName(roleName);

        if (!user.role.some(role => role.id == requiredRole.id)) {
            throw new ForbiddenException(`У пользователя нет доступа к роли ${roleName}`);
        }
        const payload: PayloadDTO = { id: user.id, activeRole: requiredRole.name }
        this.logger.warn("Смена роли", payload)


        const tokens = await this.tokenService.generateTokens(payload)
        return {
            tokens: {
                access_token: tokens.access_token,
                refresh_token: tokens.refresh_token,
            },
            user: {
                id: user.id,
                uidNumber: user.uidNumber,
                firstName: user.firstName,
                middleName: user.middleName,
                activeRole: requiredRole.name,
                roles: user.role.map(r => r.name),
            },
        };
    }



}
