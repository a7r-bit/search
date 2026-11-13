import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Kind, MatchType, SortBy } from './search.types';

export class SearchQuery {
    @ApiProperty({ description: 'Поисковый запрос', example: 'отчёт по продажам' })
    @IsString()
    @IsNotEmpty()
    readonly query: string;

    @ApiPropertyOptional({ description: 'Тип элемента', enum: Kind, default: Kind.UNSPECIFIED })
    @IsOptional()
    @IsEnum(Kind)
    readonly kind: Kind = Kind.UNSPECIFIED;

    @ApiPropertyOptional({
        description: 'Ограничение по ID элементов, CSV-список (например, доступные пользователю узлы)',
        example: 'd290f1ee-6c54-4b01-90e6-d701748f0851,1b4e28ba-2fa1-4f3e-9c1a-0d3c5e7f9a12',
    })
    @IsOptional()
    @IsString()
    readonly externalIds?: string;

    @ApiPropertyOptional({ description: 'Тип совпадения', enum: MatchType, default: MatchType.MULTI_MATCH })
    @IsOptional()
    @IsEnum(MatchType)
    readonly matchType: MatchType = MatchType.MULTI_MATCH;

    @ApiPropertyOptional({ description: 'Номер страницы', default: 1 })
    @IsOptional()
    readonly page: number = 1;

    @ApiPropertyOptional({ description: 'Количество результатов на страницу', default: 10 })
    @IsOptional()
    readonly limit: number = 10;

    @ApiPropertyOptional({ description: 'Сортировка результатов', enum: SortBy, default: SortBy.SCORE })
    @IsOptional()
    @IsEnum(SortBy)
    readonly sortBy: SortBy = SortBy.SCORE;
}
