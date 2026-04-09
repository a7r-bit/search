import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsInt, Min, Max } from 'class-validator';

export class PaginationMetaDto {
    @ApiProperty({
        example: 100,
        description: 'Total number of items',
    })
    total: number;

    @ApiProperty({
        example: 10,
        description: 'Total number of pages',
    })
    lastPage: number;

    @ApiProperty({
        example: 1,
        description: 'Current page number',
    })
    currentPage: number;

    @ApiProperty({
        example: 10,
        description: 'Number of items per page',
    })
    perPage: number;

    @ApiProperty({
        example: null,
        description: 'Previous page number (null if first page)',
        nullable: true,
    })
    prev: number | null;

    @ApiProperty({
        example: 2,
        description: 'Next page number (null if last page)',
        nullable: true,
    })
    next: number | null;
}

export class PaginatedResult<T> {
    @ApiProperty({
        isArray: true,
        description: 'Array of items for current page',
    })
    data: T[];

    @ApiProperty({
        type: PaginationMetaDto,
        description: 'Pagination metadata',
    })
    meta: PaginationMetaDto;
}

export class PaginationQueryDto {
    @ApiProperty({
        required: false,
        default: 1,
        minimum: 1,
        description: 'Page number (starts from 1)',
    })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page?: number = 1;

    @ApiProperty({
        required: false,
        default: 10,
        minimum: 1,
        maximum: 100,
        description: 'Number of items per page (max 100)',
    })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(100)
    perPage?: number = 10;
}

export interface PaginationParams {
    page?: number;
    perPage?: number;
    maxPerPage?: number;
}
