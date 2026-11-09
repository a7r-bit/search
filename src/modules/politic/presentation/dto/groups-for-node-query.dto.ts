import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class GroupsForNodeQueryDto {
    @ApiProperty({ description: 'ID узла (директории или файла)' })
    @IsUUID()
    nodeId: string;
}
