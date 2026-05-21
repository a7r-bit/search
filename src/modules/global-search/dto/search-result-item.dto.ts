import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PathPart } from '../../../common/types/path-part.dto';
import { SearchHighlightViewDto } from './search-highlight.dto';

export class DirectorySearchItemDto {
    @ApiProperty({ enum: ['directory'], example: 'directory' })
    kind: 'directory';

    @ApiProperty({ format: 'uuid' })
    id: string;

    @ApiProperty({ format: 'uuid', nullable: true })
    parentId: string | null;

    @ApiProperty()
    name: string;

    @ApiPropertyOptional({ nullable: true })
    description?: string | null;

    @ApiProperty()
    score: number;

    @ApiProperty({ type: [PathPart] })
    path: PathPart[];

    @ApiProperty({ type: SearchHighlightViewDto })
    highlight: SearchHighlightViewDto;
}

export class FileSearchItemDto {
    @ApiProperty({ enum: ['file'], example: 'file' })
    kind: 'file';

    @ApiProperty({ format: 'uuid', description: 'ID версии документа' })
    id: string;

    @ApiProperty({ format: 'uuid', description: 'ID узла файла в дереве' })
    nodeId: string;

    @ApiProperty({ format: 'uuid', nullable: true })
    parentId: string | null;

    @ApiProperty()
    fileName: string;

    @ApiProperty()
    version: number;

    @ApiProperty({ description: 'Путь к файлу в хранилище (S3 key)' })
    fileUrl: string;

    @ApiProperty({ type: String, format: 'date-time' })
    createdAt: Date;

    @ApiProperty()
    score: number;

    @ApiProperty({ type: [PathPart] })
    path: PathPart[];

    @ApiProperty({ type: SearchHighlightViewDto })
    highlight: SearchHighlightViewDto;
}

export type SearchResultItemDto = DirectorySearchItemDto | FileSearchItemDto;
