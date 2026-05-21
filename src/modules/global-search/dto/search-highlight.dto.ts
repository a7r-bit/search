import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SearchHighlightViewDto {
    @ApiProperty({
        description: 'Заголовок результата с HTML-подсветкой (<mark>)',
        example: '<mark>Новости</mark> законодательства.docx',
    })
    title: string;

    @ApiPropertyOptional({
        description: 'Фрагмент текста с HTML-подсветкой для превью',
        example: '<mark>Новости</mark> законодательства на 13.04.2026...',
        nullable: true,
    })
    snippet?: string | null;
}
