import { ApiProperty } from '@nestjs/swagger';

export class SearchResult {
    @ApiProperty({ description: 'Найденные элементы (externalId)', type: [String] })
    items: string[];

    @ApiProperty({ description: 'Общее количество найденных элементов' })
    total: number;

    @ApiProperty({ description: 'Текущая страница' })
    page: number;

    @ApiProperty({ description: 'Количество результатов на страницу' })
    limit: number;
}
