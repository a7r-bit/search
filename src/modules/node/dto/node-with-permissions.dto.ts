import { ApiProperty } from '@nestjs/swagger';
import { NodeDto } from './node.dto';
import { NodePermissionType } from '@prisma/client';

export class NodeWithPermissionsDto extends NodeDto {
    @ApiProperty({ enum: NodePermissionType, isArray: true })
    permissions: NodePermissionType[];
}
