import { NodeDto } from "./node.dto";

export function toNodeDto(n: any): NodeDto {
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