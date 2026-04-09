import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { NodeType } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class FindNodeDto {
    @ApiPropertyOptional({ enum: NodeType })
    @IsOptional()
    @IsString()
    type?: NodeType;

    @ApiProperty({
        required: false,
        description: 'Номер страницы',
        default: 1,
        minimum: 1,
    })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page?: number = 1;

    @ApiProperty({
        required: false,
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

    @ApiProperty({
        required: false,
        description: 'Поиск по имени',
    })
    @IsOptional()
    @IsString()
    search?: string;
}
