import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from '@prisma/client';

@Injectable()
export class RoleService {
    constructor(private readonly prisma: PrismaService) {}

    async getRoles() {
        return await this.prisma.role.findMany();
    }

    async getRoleWithPermissions(roleName: string) {
        const role = await this.prisma.role.findUnique({
            where: { name: roleName },
            include: { permissions: true },
        });
        if (!role) {
            throw new BadRequestException({ message: `Роль ${roleName} не найдена` });
        }
        return role;
    }
    async getRoleByName(roleName: string) {
        const role = await this.prisma.role.findUnique({
            where: { name: roleName },
        });
        if (!role) {
            throw new NotFoundException(`Роль ${roleName} не найдена`);
        }
        return role;
    }

    async gerRoleByUserId(userId: string): Promise<Role[]> {
        const roles = await this.prisma.role.findMany({ where: { users: { some: { id: userId } } } });
        return roles;
    }
}
