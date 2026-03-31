import { Node } from '@prisma/client';
import { NodeDto } from './node.dto';

export function toNodeDto(n: Node): NodeDto {
    return {
        id: n.id,
        type: n.type,
        parentId: n.parentId ?? null,
        name: n.name,
        description: n.description ?? null,
        createdAt: n.createdAt,
        updatedAt: n.updatedAt,
    };
}
