import { ApiProperty } from '@nestjs/swagger';
import { DirectorySearchItemDto, FileSearchItemDto } from './search-result-item.dto';

export class GlobalSearchResponseDto {
    @ApiProperty({
        description: 'Результаты поиска',
        type: 'array',
        items: {
            oneOf: [
                { $ref: '#/components/schemas/DirectorySearchItemDto' },
                { $ref: '#/components/schemas/FileSearchItemDto' },
            ],
        },
    })
    items: (DirectorySearchItemDto | FileSearchItemDto)[];

    @ApiProperty({ description: 'Общее количество найденных результатов' })
    total: number;

    @ApiProperty({ description: 'Текущая страница', example: 1 })
    page: number;

    @ApiProperty({ description: 'Размер страницы', example: 10 })
    limit: number;
}
