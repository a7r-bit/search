import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../shared/infrastructure/prisma/prisma.service';
import { Group, NodePermissionType } from '@prisma/client';

@Injectable()
export class GroupRepository {
    constructor(private readonly prisma: PrismaService) {}

    // --- чтение: группы ---
    // для getGroupById
    async findById(id: string): Promise<Group | null> {
        return await this.prisma.group.findUnique({ where: { id: id } });
    }

    // для isUnique
    async findByName(name: string): Promise<Group | null> {
        return await this.prisma.group.findFirst({ where: { name: name } });
    }

    // listGroups
    async searchByName(name?: string, skip?: number, take?: number): Promise<Group[]> {
        return await this.prisma.group.findMany({
            where: name?.trim() ? { name: { contains: name.trim(), mode: 'insensitive' } } : {},
            skip,
            take,
            orderBy: { name: 'asc' },
        });
    }

    // listGroups (total)
    async countByName(name?: string): Promise<number> {
        return await this.prisma.group.count({
            where: name?.trim() ? { name: { contains: name.trim(), mode: 'insensitive' } } : {},
        });
    }

    // getPoliticsByTabNumber
    async findByTabNumber(tabNumber: string): Promise<Group[]> {
        return await this.prisma.group.findMany({
            where: {
                users: {
                    some: {
                        uidNumber: tabNumber,
                    },
                },
            },
        });
    }

    // getPolicesByNodeId — без access
    async findForNode(nodeId: string): Promise<Group[]> {
        return await this.prisma.group.findMany({
            where: {
                access: {
                    some: {
                        nodeId: nodeId,
                    },
                },
            },
        });
    }

    // getGroupsForNode — с access
    async findWithAccessForNode(nodeId: string): Promise<(Group & { access: { permissions: NodePermissionType[] }[] })[]> {
        return await this.prisma.group.findMany({
            where: {
                access: {
                    some: {
                        nodeId: nodeId,
                    },
                },
            },
            include: {
                access: {
                    where: { nodeId },
                    select: { permissions: true },
                },
            },
        });
    }

    // проверка существования в updateGroupsAccesses
    async findIdsByIds(ids: string[]): Promise<{ id: string }[]> {
        return await this.prisma.group.findMany({
            where: { id: { in: ids } },
            select: { id: true },
        });
    }

    // checkUserToNodeAccess — access по цепочке нод
    async findAccessesForNodes(nodeIds: string[]): Promise<{ nodeId: string; groupId: string }[]> {
        return await this.prisma.nodeAccess.findMany({
            where: { nodeId: { in: nodeIds } },
            select: { nodeId: true, groupId: true },
        });
    }

    // --- запись: группы ---
    async create(data: { name: string }): Promise<Group> {
        return await this.prisma.group.create({
            data: {
                name: data.name,
            },
        });
    }
    async delete(id: string): Promise<Group> {
        return await this.prisma.group.delete({ where: { id: id } });
    }
    async addUsers(groupId: string, userIds: string[]): Promise<Group> {
        return await this.prisma.group.update({
            where: { id: groupId },
            data: { users: { connect: userIds.map((id) => ({ id })) } },
        });
    }
    // connect
    async removeUsers(groupId: string, userIds: string[]): Promise<Group> {
        return await this.prisma.group.update({
            where: { id: groupId },
            data: { users: { disconnect: userIds.map((id) => ({ id })) } },
        });
    }
    // disconnect

    // --- запись: nodeAccess (транзакция) ---
    async setNodeAccesses(nodeId: string, groups: { groupId: string; permissions: NodePermissionType[] }[]): Promise<void> {
        await this.prisma.$transaction(async (tx) => {
            for (const group of groups) {
                if (group.permissions.length === 0) {
                    await tx.nodeAccess.deleteMany({
                        where: { groupId: group.groupId, nodeId },
                    });
                    continue;
                }

                await tx.nodeAccess.upsert({
                    where: { groupId_nodeId: { groupId: group.groupId, nodeId } },
                    create: { groupId: group.groupId, nodeId, permissions: group.permissions },
                    update: { permissions: group.permissions },
                });
            }
        });
    }
}
