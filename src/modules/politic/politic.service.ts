import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma';
import { CreateGroupDTO } from './dto/create-group.dto';
import { isUUID } from 'class-validator';
import { Group, NodePermissionType } from '@prisma/client';
import { EmployeesParserService } from '../../infrastructure/employees-parser';
import { toGroupDTO } from './dto/group-mapper';

@Injectable()
export class PoliticService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly employeesParserService: EmployeesParserService,
    ) {}

    private async getGroupById(groupId: string) {
        if (!isUUID(groupId)) {
            throw new BadRequestException('ID не валиден.');
        }

        const group: Group = await this.prisma.group.findUnique({
            where: { id: groupId },
        });
        if (!group) {
            throw new NotFoundException(`Групповая политика не найдена`);
        }
        return group;
    }

    async syncGroups() {
        const extenalGroups = await this.employeesParserService.getDepartmentsList(1, 5000);
        return await this.prisma.$transaction(async (tx) => {
            for (const group of extenalGroups) {
                await tx.group.upsert({
                    where: { externalId: group.id },
                    create: {
                        externalId: group.id,
                        name: group.name,
                    },
                    update: {
                        name: group.name,
                    },
                });
            }
        });
    }

    async getPoliticsByTabNumber(tabNumber: string) {
        const groups = await this.prisma.group.findMany({
            where: {
                users: {
                    some: {
                        uidNumber: tabNumber,
                    },
                },
            },
        });
        return groups.map((group) => toGroupDTO(group));
    }

    async getPolicesByNodeId(nodeId: string) {
        if (!isUUID(nodeId)) {
            throw new BadRequestException('ID не валиден.');
        }
        const node = await this.prisma.node.findUnique({ where: { id: nodeId } });

        if (!node) {
            throw new NotFoundException(`Директория не найдена`);
        }
        const groups = await this.prisma.group.findMany({
            where: {
                access: {
                    some: {
                        nodeId,
                    },
                },
            },
        });
        return groups.map((group) => toGroupDTO(group));
    }
    async addUsersToGroup(usersIds: string[], groupId: string) {
        await this.getGroupById(groupId);
        return await this.prisma.group.update({
            where: { id: groupId },
            data: { users: { connect: usersIds.map((id) => ({ id })) } },
        });
    }
    async deleteUsersFromGroup(usersIds: string[], groupId: string) {
        await this.getGroupById(groupId);
        return await this.prisma.group.update({
            where: { id: groupId },
            data: { users: { disconnect: usersIds.map((id) => ({ id })) } },
        });
    }

    async checkUserToNodeAccess(userPolicies: string[], nodeId: string | null): Promise<boolean> {
        if (!nodeId) {
            return true;
        }
        const node = await this.prisma.node.findUnique({
            where: { id: nodeId },
            select: { id: true, parentId: true },
        });

        if (!node) {
            return false;
        }

        const nodePolicies = (await this.getPolicesByNodeId(node.id)).map((p) => p.id);

        if (nodePolicies.length > 0) {
            const hasMatch = nodePolicies.some((id) => userPolicies.includes(id));
            return hasMatch;
        }

        return this.checkUserToNodeAccess(userPolicies, node.parentId);
    }

    async resolveNodePermissions(userGroups: string[], nodeId: string | null): Promise<NodePermissionType[]> {
        if (nodeId === null) return [];

        const node = await this.prisma.node.findUnique({
            where: { id: nodeId },
            include: { accesses: true },
        });
        if (!node) return [];
        if (node.accesses.length > 0) {
            const matching = node.accesses.filter((assec) => userGroups.includes(assec.groupId));
            if (matching.length === 0) return [];
            const res = matching.flatMap((m) => m.permissions);
            // Logger.log(PoliticService.name, res)
            return res;
        }
        return this.resolveNodePermissions(userGroups, node.parentId);
    }

    async createGroup(createDTO: CreateGroupDTO) {
        const isUnique = await this.isUnique(createDTO.name);
        if (!isUnique) {
            throw new BadRequestException(`Групповая политика с названием ${createDTO.name} уже существует`);
        }
        return await this.prisma.group.create({
            data: {
                name: createDTO.name,
            },
        });
    }

    async deleteGroup(groupId: string) {
        return await this.prisma.group.delete({ where: { id: groupId } });
    }

    private async isUnique(name: string) {
        const group = await this.prisma.group.findUnique({
            where: {
                name: name,
            },
        });
        return group ? false : true;
    }
}
