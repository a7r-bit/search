import { Injectable } from '@nestjs/common';
import { NodeTreeRepository } from '../../../modules/node/domain/node-tree.repository';
import { PrismaService } from '../../../shared/infrastructure/prisma/prisma.service';
import { NodePermissionType } from '@prisma/client';

@Injectable()
export class PermissionResolverService {
    constructor(
        private readonly nodeTreeRepository: NodeTreeRepository,
        private readonly prisma: PrismaService,
    ) {}

    /**
     * Разрешение прав на ноде снизу вверх:
     * - у ноды есть nodeAccess — они решают: совпавшая группа → её permissions, не совпала → пусто;
     * - у ноды нет nodeAccess — наследуем от родителя;
     * - выше корня → READ (открыто для всех)
     */
    async resolveNodePermissions(userGroups: string[], nodeId: string | null): Promise<NodePermissionType[]> {
        if (!nodeId) return [NodePermissionType.READ];

        const accesses = await this.prisma.nodeAccess.findMany({
            where: { nodeId },
            select: { groupId: true, permissions: true },
        });

        if (accesses.length > 0) {
            const matched = accesses.filter((a) => userGroups.includes(a.groupId));
            if (matched.length === 0) return [];
            return [...new Set(matched.flatMap((a) => a.permissions))];
        }

        const parentNode = await this.nodeTreeRepository.getParent(nodeId);
        return this.resolveNodePermissions(userGroups, parentNode?.id ?? null);
    }
}
