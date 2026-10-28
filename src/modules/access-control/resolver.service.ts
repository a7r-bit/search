import { Injectable } from '@nestjs/common';
import { NodeTreeRepository } from '../node/node-tree.repository';
import { PrismaService } from '../prisma';
import { NodePermissionType } from '@prisma/client';

@Injectable()
export class PermissionResolverService {
    constructor(
        private readonly nodeTreeRepository: NodeTreeRepository,
        private readonly prisma: PrismaService,
    ) {}

    /**
     * Resolwing permissions for current Node
     * If node doesn't have any permission turn up to parents
     */
    async resolveNodePermissions(userGroups: string[], nodeId: string | null): Promise<NodePermissionType[]> {
        if (!nodeId) return [NodePermissionType.READ];

        // Get permissions for current nodeId by user groups
        const permissions = await this.getNodePermissionsForGroups(nodeId, userGroups);

        if (permissions.length > 0) {
            return [...new Set(permissions)];
        }

        // If no permissions found, check parent node permissions
        const parentNode = await this.nodeTreeRepository.getParent(nodeId);
        return this.resolveNodePermissions(userGroups, parentNode?.parentId ?? null);
    }

    private async getNodePermissionsForGroups(nodeId: string, userGroups: string[]): Promise<NodePermissionType[]> {
        const accesses = await this.prisma.nodeAccess.findMany({
            where: {
                nodeId: nodeId,
                groupId: { in: userGroups },
            },
            select: { permissions: true },
        });
        return accesses.flatMap((a) => a.permissions);
    }
}
