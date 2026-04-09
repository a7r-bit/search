import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, IsUUID, Max, Min } from 'class-validator';
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

    @ApiPropertyOptional({
        description: 'Номер страницы',
        default: 1,
        minimum: 1,
    })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page?: number = 1;

    @ApiPropertyOptional({
        description: 'Элементов на странице',
        default: 10,
        minimum: 1,
        maximum: 100,
    })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(100)
    perPage?: number = 10;
}
