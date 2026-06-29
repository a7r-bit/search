import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma';
import { CreateGroupDTO } from './dto/create-group.dto';
import { isUUID } from 'class-validator';
import { Group, NodePermissionType, Prisma } from '@prisma/client';
import { EmployeesParserService } from '../../infrastructure/employees-parser';
import { toGroupDTO } from './dto/group-mapper';
import { ListGroupQueryDto } from './dto/list-group-query.dto';
import { PaginatedGroupResponseDto } from './dto/paginated-group-response.dto';
import { GroupWithAccessesDTO } from './dto/group-with-accesses.dto';
import { UpdateGroupsAccessesDTO } from './dto/update-group-access.dto';

@Injectable()
export class PoliticService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly employeesParserService: EmployeesParserService,
    ) {}

    async updateGroupsAccesses(nodeId: string, body: UpdateGroupsAccessesDTO): Promise<GroupWithAccessesDTO[]> {
        const node = await this.prisma.node.findUnique({ where: { id: nodeId } });
        if (!node) {
            throw new NotFoundException('Директория не найдена');
        }

        const groupIds = body.groups.map((group) => group.groupId);
        const uniqueGroupIds = new Set(groupIds);
        if (uniqueGroupIds.size !== groupIds.length) {
            throw new BadRequestException('Список групп содержит дубликаты.');
        }

        const existingGroups = await this.prisma.group.findMany({
            where: { id: { in: groupIds } },
            select: { id: true },
        });
        Logger.log(existingGroups);
        Logger.log(groupIds);
        if (existingGroups.length !== groupIds.length) {
            throw new NotFoundException('Групповая политика не найдена');
        }

        await this.prisma.$transaction(async (tx) => {
            for (const group of body.groups) {
                if (group.accesses.length === 0) {
                    await tx.nodeAccess.deleteMany({
                        where: { groupId: group.groupId, nodeId },
                    });
                    continue;
                }

                await tx.nodeAccess.upsert({
                    where: { groupId_nodeId: { groupId: group.groupId, nodeId } },
                    create: { groupId: group.groupId, nodeId, permissions: group.accesses },
                    update: { permissions: group.accesses },
                });
            }
        });

        return this.getGroupsForNode(nodeId);
    }

    //    Get list of group
    async listGroups(query: ListGroupQueryDto): Promise<PaginatedGroupResponseDto> {
        const page = Number(query.page) ?? 1;
        const limit = Number(query.limit) ?? 20;
        const skip = (page - 1) * limit;

        const where: Prisma.GroupWhereInput = query.search?.trim() ? { name: { contains: query.search.trim(), mode: 'insensitive' } } : {};

        const [groups, total] = await this.prisma.$transaction([
            this.prisma.group.findMany({
                where,
                skip,
                take: limit,
                orderBy: { name: 'asc' },
            }),
            this.prisma.group.count({ where }),
        ]);
        return {
            items: groups.map(toGroupDTO),
            total,
            page,
            limit,
        };
    }

    async getGroupsForNode(nodeId: string): Promise<GroupWithAccessesDTO[]> {
        if (!isUUID(nodeId)) {
            throw new BadRequestException('ID не валиден.');
        }

        const node = await this.prisma.node.findUnique({ where: { id: nodeId } });
        if (!node) {
            throw new NotFoundException('Директория не найдена');
        }

        const groups = await this.prisma.group.findMany({
            where: {
                access: {
                    some: { nodeId },
                },
            },
            include: {
                access: {
                    where: { nodeId },
                    select: { permissions: true },
                },
            },
            orderBy: { name: 'asc' },
        });

        return groups.map((group) => ({
            id: group.id,
            name: group.name,
            accesses: group.access.flatMap((access) => access.permissions),
        }));
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

    async resolveNodePermissions(userGroups: string[], nodeId: string | null, visited = new Set<string>()): Promise<NodePermissionType[]> {
        if (!nodeId) return [NodePermissionType.READ];

        if (visited.has(nodeId)) {
            return [NodePermissionType.READ];
        }
        visited.add(nodeId);

        const node = await this.prisma.node.findUnique({
            where: { id: nodeId },
            select: {
                parentId: true,
                accesses: {
                    select: {
                        groupId: true,
                        permissions: true,
                    },
                },
            },
        });

        if (!node) return [NodePermissionType.READ];

        if (node.accesses.length > 0) {
            const permissions = node.accesses
                .filter((access) => userGroups.includes(access.groupId))
                .flatMap((access) => access.permissions);

            return [...new Set(permissions)];
        }

        return this.resolveNodePermissions(userGroups, node.parentId, visited);
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

    async hasAdminOnNode(userGroups: string[], nodeId: string): Promise<boolean> {
        if (!isUUID(nodeId)) return false;
        return await this.hasNodePermission(userGroups, nodeId, NodePermissionType.ADMIN);
    }

    private async hasNodePermission(userGroups: string[], nodeId: string, permission: NodePermissionType): Promise<boolean> {
        const permissions = await this.resolveNodePermissions(userGroups, nodeId);
        return permissions.includes(permission);
    }

    private async isUnique(name: string) {
        const group = await this.prisma.group.findUnique({
            where: {
                name: name,
            },
        });
        return group ? false : true;
    }

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
}
