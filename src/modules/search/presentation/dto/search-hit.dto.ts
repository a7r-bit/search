import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PathPart } from '../../../../shared/domain/types/path-part.dto';

// Сырой хит поискового микросервиса
export interface SearchRawHit {
    externalId: string;
    kind?: string;
    score?: number;
    title?: string;
    highlight?: { field: string; snippets: string[] };
}

// Сырой ответ поискового микросервиса
export interface SearchResult {
    items: (string | SearchRawHit)[];
    total: number;
    page: number;
    limit: number;
}

export class SearchHitDto {
    @ApiProperty({ description: 'ID сущности в индексе (для документов — ID версии, для папок — ID ноды)' })
    externalId: string;

    @ApiProperty({ description: 'ID ноды в дереве документов' })
    nodeId: string;

    @ApiProperty({ description: 'Тип элемента', example: 'document' })
    kind: string;

    @ApiProperty({ description: 'Название элемента (из индекса)' })
    title: string;

    @ApiProperty({ description: 'Релевантность' })
    score: number;

    @ApiPropertyOptional({ description: 'Подсветка совпадений', nullable: true })
    highlight: { field: string; snippets: string[] } | null;

    @ApiProperty({ description: 'Путь в дереве от корня до элемента', type: [PathPart] })
    path: PathPart[];

    @ApiPropertyOptional({ description: 'Версия документа (null для папок)', nullable: true })
    version: number | null;

    @ApiProperty({ description: 'Дата создания элемента', format: 'date-time' })
    createdAt: string;
}

export class SearchResultDto {
    @ApiProperty({ description: 'Найденные элементы', type: [SearchHitDto] })
    items: SearchHitDto[];

    @ApiProperty({ description: 'Общее количество найденных элементов' })
    total: number;

    @ApiProperty({ description: 'Текущая страница' })
    page: number;

    @ApiProperty({ description: 'Количество результатов на страницу' })
    limit: number;
}
