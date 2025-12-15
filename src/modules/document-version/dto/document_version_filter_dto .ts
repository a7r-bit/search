import { ApiPropertyOptional } from '@nestjs/swagger';
import { ConversionStatus } from '@prisma/client';

export class DocumentVersionFilterDto {
    @ApiPropertyOptional({ description: 'Фильтр по имени файла', example: 'Заключение' })
    fileName?: string;

    @ApiPropertyOptional({ description: 'Статус конверсии', enum: ConversionStatus })
    conversionStatus?: ConversionStatus
}