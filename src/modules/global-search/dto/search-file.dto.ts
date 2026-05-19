import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID } from 'class-validator';

export class SearchFileDto {
    @IsOptional()
    @IsUUID()
    @ApiPropertyOptional({
        description: 'ID текущего узла (папки), внутри которой выполняется поиск',
        format: 'uuid',
        nullable: true,
        example: '82b64248-667e-4a91-92ea-13a89764ca77',
    })
    currentNodeId?: string | null;

    @IsString()
    @ApiProperty({
        description: 'Поисковый запрос',
        example: 'отчёт',
    })
    searchQuery: string;
}
