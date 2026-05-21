import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {  IsNotEmpty, IsString, IsUUID, MinLength } from 'class-validator';

export class SearchFileDto {
    @IsUUID()
    @ApiProperty({
        description: 'ID текущего узла (папки), внутри которой выполняется поиск',
        format: 'uuid',
        example: '82b64248-667e-4a91-92ea-13a89764ca77',
    })
    @IsNotEmpty()
    currentNodeId: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    @Transform(({value})=>value.trim())
    @ApiProperty({
        description: 'Поисковый запрос',
        example: 'отчёт',
    })
    searchQuery: string;
}
