import { ApiProperty } from '@nestjs/swagger';
import { NodePermissionType } from '@prisma/client';

export class GroupDTO {
    @ApiProperty()
    id: string;

    @ApiProperty()
    name: string;
}
