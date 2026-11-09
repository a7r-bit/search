import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID } from 'class-validator';
import { NodeType } from '@prisma/client';

export class ListNodesQueryDto {
    @ApiPropertyOptional({ description: 'Node Id родительской Node' })
    @IsOptional()
    @IsUUID()
    parentId?: string;

    @ApiPropertyOptional({ enum: NodeType })
    @IsOptional()
    @IsString()
    type?: NodeType;
}
