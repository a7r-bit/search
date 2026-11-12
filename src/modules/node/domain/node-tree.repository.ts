import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../shared/infrastructure/prisma/prisma.service';
import { NodeType } from '@prisma/client';
import { PathPart } from '../../../shared/domain/types/path-part.dto';

@Injectable()
export class NodeTreeRepository {
    constructor(private readonly prisma: PrismaService) {}

    async recursiveDelete(id: string) {
        const descendantsId = await this.getDescendantIds(id);
        return await this.prisma.node.deleteMany({
            where: { id: { in: descendantsId } },
        });
    }

    async getDescendantIds(nodeId: string): Promise<string[]> {
        const descendants: { id: string }[] = await this.prisma.$queryRaw`
        WITH RECURSIVE r AS (
        SELECT id FROM nodes WHERE id = ${nodeId}::uuid
        UNION ALL
        SELECT n.id
        FROM nodes n
        INNER JOIN r ON n.parent_id = r.id
        )
        SELECT id FROM r;
        `;
        return descendants.map((descendant: { id: string }) => descendant.id);
    }

    async getPath(id: string | null): Promise<PathPart[]> {
        if (!id) return [];
        const nodes: { id: string; name: string }[] = await this.prisma.$queryRaw`
        WITH RECURSIVE r AS (
        SELECT id, name, parent_id, 1 as depth 
        FROM nodes 
        WHERE id = ${id}::uuid
        UNION ALL
        SELECT n.id, n.name, n.parent_id, r.depth + 1
        FROM nodes n
        INNER JOIN r ON n.id = r.parent_id
        )
        SELECT id, name FROM r ORDER BY depth DESC; 
        `;
        return nodes.map((node: { id: string; name: string }) => ({ id: node.id, name: node.name }));
    }

    async getParent(nodeId: string) {
        const currentNode = await this.prisma.node.findUnique({
            where: { id: nodeId },
            select: { parentId: true },
        });

        if (!currentNode || !currentNode.parentId) return null;

        return await this.prisma.node.findUnique({
            where: { id: currentNode.parentId },
        });
    }

    async isDescendant(candidateId: string, ancestorId: string): Promise<boolean> {
        if (candidateId === ancestorId) return false;

        const result = await this.prisma.$queryRaw<{ exists: boolean }[]>`
        WITH RECURSIVE r AS (
        SELECT parent_id FROM nodes WHERE id = ${candidateId}::uuid

        UNION ALL

        SELECT n.parent_id
        FROM nodes n
        INNER JOIN r ON n.id = r.parent_id
        WHERE r.parent_id IS NOT NULL
        )
        SELECT EXISTS (
        SELECT 1 FROM r WHERE parent_id = ${ancestorId}::uuid
        ) as "exists";
        `;

        return result[0]?.exists ?? false;
    }

    async getAncestorChain(nodeId: string): Promise<string[]> {
        const rows: { id: string }[] = await this.prisma.$queryRaw`
        WITH RECURSIVE r AS (
        SELECT id, parent_of, 0 AS depth FROM nodes
        WHERE id = ${nodeId}::uuid
        
        UNION ALL

        SELECT n.id, n.parent_id, r.depth+1 FROM nodes n
        INNER JOIN r on n.parent_id = r.id
        )
        SELECT id FROM r ORDER BY depth ASC; 
        `;
        return rows.map((r) => r.id);
    }

    async validateParent(parentId: string | null): Promise<{ isValid: boolean; error?: string }> {
        if (!parentId) return { isValid: true };
        const parent = await this.prisma.node.findUnique({
            where: { id: parentId },
            select: { id: true, type: true },
        });

        if (parent.type !== NodeType.DIRECTORY) {
            return { isValid: false, error: 'Родительская директория должна быть типа ' + NodeType.DIRECTORY };
        }

        return {
            isValid: true,
        };
    }
}
