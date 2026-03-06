import { NodePermissionType } from "@prisma/client";
import { NodeDto } from "./node.dto";
import { NodeWithPermissionsDto } from "./node-with-permissions.dto";


export function toNodeWithPermissionsDto(nodeDto: NodeDto, permissions: NodePermissionType[]): NodeWithPermissionsDto {
    return {
        id: nodeDto.id,
        type: nodeDto.type,
        parentId: nodeDto.parentId ?? null,
        name: nodeDto.name,
        description: nodeDto.description ?? null,
        createdAt: nodeDto.createdAt,
        updatedAt: nodeDto.updatedAt,
        permissions
    };
}