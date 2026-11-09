import { BadRequestException, ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { RoleService } from '../role/role.service';
import { PayloadDTO } from '../token/dto/payload.dto';
import { TokenService } from '../token/token.service';
import { PoliticService } from '../politic/politic.service';
import { EmployeesParserService } from '../../infrastructure/employees-parser/employees-parser.service';
import { UserProvisioningService } from '../../user-provisioning/user-provisioning.service';
import { RequestUser } from '../../common/types/request-user';
import Logger, { LoggerKey } from '../../infrastructure/logger/domain/logger';

@Injectable()
export class AuthService {
    constructor(
        @Inject(LoggerKey) private readonly logger: Logger,
        private readonly userService: UserService,
        private readonly roleService: RoleService,
        private readonly tokenService: TokenService,
        private readonly groupService: PoliticService,
        private readonly employeesService: EmployeesParserService,
        private readonly userProvisioningService: UserProvisioningService,
    ) {}
    async signIn(req: any) {
        const reqUser: RequestUser = req.user;

        const userExternal = await this.employeesService.getUserByTabNumber(reqUser.uidNumber);
        const externalPoliticGroups = await this.employeesService.getDepartmentArrayFromHierarchy(userExternal.departments);
        const user = await this.userProvisioningService.provisionFromExternal({
            uidNumber: userExternal.ldap_tab_num,
            firstName: userExternal.fname,
            middleName: userExternal.surname,
            departments: externalPoliticGroups.map((group) => ({ externalId: group.id, name: group.name })),
        });

        // Получение групп пользователя для доступа к Node и NodeAccess
        const politicGroups = await this.groupService.getPoliticsByTabNumber(user.uidNumber);

        const payload: PayloadDTO = {
            id: user.id,
            activeRole: user.role[0].name,
            politicGroups: politicGroups.map((g) => g.id),
        };

        const tokens = await this.tokenService.generateTokens(payload);

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
                activeRole: user.role[0].name,
                roles: user.role.map((r) => r.name),
            },
        };
    }

    async switchRole(req: any, roleName: string) {
        const reqUser: RequestUser = req.user;

        if (!reqUser) {
            throw new BadRequestException('Пользователь не найден');
        }

        const user = await this.userService.findOne(reqUser.id);

        const requiredRole = await this.roleService.getRoleByName(roleName);
        const userRoles = await this.roleService.gerRoleByUserId(reqUser.id);

        if (!userRoles.some((role) => role.id == requiredRole.id)) {
            throw new ForbiddenException(`У пользователя нет доступа к роли ${roleName}`);
        }

        const politicGroups = await this.groupService.getPoliticsByTabNumber(user.uidNumber);

        const payload: PayloadDTO = {
            id: user.id,
            activeRole: requiredRole.name,
            politicGroups: politicGroups.map((g) => g.id),
        };
        this.logger.warn(`Смена роли userId: ${reqUser.id} с ${reqUser.activeRole} на ${requiredRole.name}`);

        const tokens = await this.tokenService.generateTokens(payload);
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
                roles: userRoles.map((r) => r.name),
            },
        };
    }
    async getMe(req: any) {
        const reqUser: RequestUser = req.user;
        const user = await this.userService.findOne(reqUser.id);
        const userRoles = await this.roleService.gerRoleByUserId(reqUser.id);

        return {
            id: user.id,
            uidNumber: user.uidNumber,
            firstName: user.firstName,
            middleName: user.middleName,
            activeRole: reqUser.activeRole,
            roles: userRoles.map((r) => r.name),
        };
    }

    async signOut(req: any) {
        const reqUser: RequestUser = req.user;
        await this.tokenService.remoteRefreshToken(reqUser.id);
        return { message: 'Выход из системы успешно выполнен' };
    }
}
