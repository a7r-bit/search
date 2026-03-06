import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma';
import { Role } from '@prisma/client';
import { GROUP_TO_ROLE } from '../../common/constants';

@Injectable()
export class RoleService {
    constructor(private readonly prisma: PrismaService) { }

    async mapLdapGroupsToRoles(groups: string[]): Promise<Role[]> {
        const roleName = groups.map((group) => GROUP_TO_ROLE[group]).filter(Boolean)

        return await this.prisma.role.findMany({ where: { name: { in: roleName } } })
    }

    async getRoleWithPermissions(roleName: string) {
        const role = await this.prisma.role.findUnique({ where: { name: roleName }, include: { permissions: true } })
        if (!role) {
            throw new BadRequestException({ message: `Роль ${roleName} не найдена` })
        }
        return role
    }
    async getRoleByName(roleName: string) {
        const role = await this.prisma.role.findUnique({ where: { name: roleName } })
        if (!role) {
            throw new NotFoundException(`Роль ${roleName} не найдена`)
        }
        return role
    }
}
