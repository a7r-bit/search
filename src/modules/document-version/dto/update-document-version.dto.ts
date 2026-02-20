import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsString } from 'class-validator';

export class UpdateDocumentVersionDto {
    @ApiProperty({ description: `Номер версии`, example: 1 })
    @Transform(({ value }) => Number(value))
    version: number

    @ApiProperty({ description: `Название файла`, example: "A2 Grammar Resources" })
    @IsString()
    fileName: string
}
