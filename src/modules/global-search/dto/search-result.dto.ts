import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ElasticTypes } from '../../../common/constants';
import { NodeType } from '@prisma/client';

export class SearchHighlightDto {
    @ApiPropertyOptional({ type: [String] })
    name?: string[];

    @ApiPropertyOptional({ type: [String] })
    description?: string[];

    @ApiPropertyOptional({ type: [String] })
    fileName?: string[];

    @ApiPropertyOptional({ type: [String] })
    content?: string[];
}

export class NodeSearchResultDto {
    @ApiProperty({ format: 'uuid' })
    id: string;

    @ApiProperty({ enum: ElasticTypes, example: ElasticTypes.Node })
    index: ElasticTypes;

    @ApiProperty()
    score: number;

    @ApiPropertyOptional({ type: SearchHighlightDto })
    highlight?: SearchHighlightDto;

    @ApiProperty({ enum: NodeType })
    type: NodeType;

    @ApiProperty()
    name: string;

    @ApiPropertyOptional()
    description?: string;
}

export class DocumentVersionSearchResultDto {
    @ApiProperty({ format: 'uuid' })
    id: string;

    @ApiProperty({ enum: ElasticTypes, example: ElasticTypes.DocumentVersion })
    index: ElasticTypes;

    @ApiProperty()
    score: number;

    @ApiPropertyOptional({ type: SearchHighlightDto })
    highlight?: SearchHighlightDto;

    @ApiProperty()
    version: number;

    @ApiProperty()
    fileName: string;

    @ApiProperty()
    fileUrl: string;

    @ApiProperty({ type: String, format: 'date-time' })
    createdAt: Date;
}

export interface BaseSearchResultDTO {
    id: string;
    index: ElasticTypes;
    score: number;
    highlight?: {
        name?: string[];
        description?: string[];
        fileName?: string[];
        content?: string[];
    };
}

function clearLines(value: string[]) {
    return value.map((item) => item.replace(/\n/g, ' '));
}

function cleanHighlight(highlight: any) {
    if (!highlight) return undefined;

    const cleaned: any = {};
    for (const key of Object.keys(highlight)) {
        cleaned[key] = clearLines(highlight[key]);
    }
    return cleaned;
}
export interface NodeSearchResultDTO extends BaseSearchResultDTO {
    type: NodeType;
    name: string;
    description?: string;
}
export interface DocumentVersionSearchResultDTO extends BaseSearchResultDTO {
    version: number;
    fileName: string;
    fileUrl: string;
    createdAt: Date;
}

export type SearchResultDTO = NodeSearchResultDTO | DocumentVersionSearchResultDTO;

export function normalizeElasticHit(hit: any): SearchResultDTO {
    const index = hit._index as ElasticTypes;
    const id = hit._id;
    const score = hit._score;
    const highlight = cleanHighlight(hit.highlight) as BaseSearchResultDTO['highlight'] | undefined;
    const src = hit._source ?? {};

    switch (index) {
        case ElasticTypes.Node:
            return {
                id,
                index,
                score,
                highlight,
                type: src.type as NodeType,
                name: src.name ?? '',
                description: src.description ?? undefined,
            };

        case ElasticTypes.DocumentVersion:
            return {
                id,
                index,
                score,
                highlight,
                version: src.version,
                fileUrl: '/' + src.path.replace(/\\/g, '/').replace(/^\/+/, ''),
                fileName: src.fileName,
                createdAt: src.createdAt,
            };

        default:
            // Обязательно либо вернуть значение, либо кинуть ошибку
            throw new Error(`Unsupported index in normalizeElasticHit: ${index}`);
    }
}
