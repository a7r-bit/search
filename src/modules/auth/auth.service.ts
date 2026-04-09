import { BadRequestException, ForbiddenException, Injectable, Logger } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { RoleService } from '../role';
import { PayloadDTO, TokenService } from '../token';
import { PoliticService } from '../politic/politic.service';
import { EmployeesParserService } from '../../infrastructure/employees-parser';
import { PrismaService } from '../prisma';
import { RequestUser } from '../../common/types/request-user';

@Injectable()
export class AuthService {
    private readonly logger = new Logger(AuthService.name);

    constructor(
        private readonly userService: UserService,
        private readonly roleService: RoleService,
        private readonly tokenService: TokenService,
        private readonly groupService: PoliticService,
        private readonly employeesService: EmployeesParserService,
        private readonly prisma: PrismaService,
    ) { }
    async signIn(req: any) {
        const reqUser: RequestUser = req.user;

        const userExternal = await this.employeesService.getUserByTabNumber(reqUser.uidNumber);

        const politicGroups = await this.employeesService.getDepartmentArrayFromHierarchy(userExternal.departments);

        const user = await this.prisma.user.upsert({
            where: { uidNumber: userExternal['tab_num'] },
            create: {
                firstName: userExternal['fname'],
                middleName: userExternal['surname'],
                uidNumber: userExternal['tab_num'],
                role: {
                    connect: {
                        name: 'User',
                    },
                },
                politicsGroups: {
                    connectOrCreate: politicGroups.map((group) => ({
                        where: { externalId: group.id },
                        create: {
                            name: group.name,
                            externalId: group.id,
                        },
                    })),
                },
            },
            update: {
                firstName: userExternal['fname'],
                middleName: userExternal['surname'],
                uidNumber: userExternal['tab_num'],
                politicsGroups: {
                    connectOrCreate: politicGroups.map((group) => ({
                        where: { externalId: group.id },
                        create: {
                            name: group.name,
                            externalId: group.id,
                        },
                    })),
                },
            },
            include: {
                role: true,
            },
        });

        const payload: PayloadDTO = {
            id: user.id,
            activeRole: user.role[0].name,
            politicGroups: politicGroups.map((g) => g.id),
        };
        this.logger.warn(`Вход в программу userId: ${payload.id}`);

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

        const user = await this.userService.findOne(reqUser.id, { includeRoles: true });

        const requiredRole = await this.roleService.getRoleByName(roleName);

        if (!user.role.some((role) => role.id == requiredRole.id)) {
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
                roles: user.role.map((r) => r.name),
            },
        };
    }
}
