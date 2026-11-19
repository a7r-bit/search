import { BadRequestException, ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { UserService } from '../../user/application/user.service';
import { RoleService } from '../../role/application/role.service';
import { PayloadDTO } from '../../token/presentation/dto/payload.dto';
import { TokenService } from '../../token/application/token.service';
import { GroupService } from '../../politic/application/group.service';
import { EmployeesParserService } from '../../employees-parser/application/employees-parser.service';
import { UserProvisioningService } from '../../user-provisioning/application/user-provisioning.service';
import { RequestUser } from '../../../shared/domain/types/request-user';
import { LdapUserPayload } from '../../ldap/domain/ldap.user.payload';
import Logger, { LOGGER_KEY } from '../../../shared/infrastructure/logger/domain/logger';

@Injectable()
export class AuthService {
    constructor(
        @Inject(LOGGER_KEY) private readonly logger: Logger,
        private readonly userService: UserService,
        private readonly roleService: RoleService,
        private readonly tokenService: TokenService,
        private readonly groupService: GroupService,
        private readonly employeesService: EmployeesParserService,
        private readonly userProvisioningService: UserProvisioningService,
    ) {}
    async signIn(ldapUser: LdapUserPayload) {
        const userExternal = await this.employeesService.getUserByTabNumber(ldapUser.uidNumber);
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

    async switchRole(requestUser: RequestUser, roleName: string) {
        if (!requestUser) {
            throw new BadRequestException('Пользователь не найден');
        }

        const user = await this.userService.findOne(requestUser.id);

        const requiredRole = await this.roleService.getRoleByName(roleName);
        const userRoles = await this.roleService.getRoleByUserId(requestUser.id);

        if (!userRoles.some((role) => role.id == requiredRole.id)) {
            throw new ForbiddenException(`У пользователя нет доступа к роли ${roleName}`);
        }

        const politicGroups = await this.groupService.getPoliticsByTabNumber(user.uidNumber);

        const payload: PayloadDTO = {
            id: user.id,
            activeRole: requiredRole.name,
            politicGroups: politicGroups.map((g) => g.id),
        };
        this.logger.warn(`Смена роли userId: ${requestUser.id} с ${requestUser.activeRole} на ${requiredRole.name}`);

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
    async getMe(requestUser: RequestUser) {
        const user = await this.userService.findOne(requestUser.id);
        const userRoles = await this.roleService.getRoleByUserId(requestUser.id);

        return {
            id: user.id,
            uidNumber: user.uidNumber,
            firstName: user.firstName,
            middleName: user.middleName,
            activeRole: requestUser.activeRole,
            roles: userRoles.map((r) => r.name),
        };
    }

    async signOut(requestUser: RequestUser) {
        await this.tokenService.remoteRefreshToken(requestUser.id);
        return { message: 'Выход из системы успешно выполнен' };
    }
}
