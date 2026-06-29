import { ApiProperty } from '@nestjs/swagger';
import { NodePermissionType } from '@prisma/client';
import { Type } from 'class-transformer';
import { ArrayNotEmpty, IsArray, IsEnum, IsUUID, ValidateNested } from 'class-validator';

export class UpdateGroupAccessItemDTO {
    @ApiProperty({ description: 'ID группы' })
    @IsUUID()
    groupId: string;

    @ApiProperty({ description: 'Права доступа группы к узлу', enum: NodePermissionType, isArray: true })
    @IsArray()
    @IsEnum(NodePermissionType, { each: true })
    accesses: NodePermissionType[];
}

export class UpdateGroupsAccessesDTO {
    @ApiProperty({ description: 'Группы с правами доступа', type: UpdateGroupAccessItemDTO, isArray: true })
    @IsArray()
    @ArrayNotEmpty()
    @ValidateNested({ each: true })
    @Type(() => UpdateGroupAccessItemDTO)
    groups: UpdateGroupAccessItemDTO[];
}
