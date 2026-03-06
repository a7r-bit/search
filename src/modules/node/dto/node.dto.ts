import { ApiProperty } from "@nestjs/swagger";
import { NodePermissionType, NodeType } from "@prisma/client";

export class NodeDto {
    @ApiProperty()
    id: string;
    @ApiProperty({ enum: NodeType })
    type: NodeType;

    @ApiProperty({ nullable: true })
    parentId: string | null;

    @ApiProperty()
    name: string;
    @ApiProperty({ nullable: true })
    description: string | null;

    // @ApiProperty({ enum: NodePermissionType, isArray: true })
    // permissions: NodePermissionType[];

    @ApiProperty()
    createdAt: Date;
    @ApiProperty()
    updatedAt: Date;


}