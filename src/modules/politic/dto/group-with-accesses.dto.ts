import { ApiProperty } from '@nestjs/swagger';
import { NodePermissionType } from '@prisma/client';
import { GroupDTO } from '../../../common/types/group-dto';

export class GroupWithAccessesDTO extends GroupDTO {
    @ApiProperty({ description: 'Права доступа группы к узлу', enum: NodePermissionType, isArray: true })
    accesses: NodePermissionType[];
}