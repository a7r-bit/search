import { ApiPropertyOptional } from '@nestjs/swagger';
import { ConversionStatus } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';

export class DocumentVersionFilterDto {
    @ApiPropertyOptional({
        description: 'Фильтр по имени файла',
        example: 'Заключение',
    })
    fileName?: string;

    @ApiPropertyOptional({
        description: 'Статус конверсии',
        enum: ConversionStatus,
    })
    conversionStatus?: ConversionStatus;

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
