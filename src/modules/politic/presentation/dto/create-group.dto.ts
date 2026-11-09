import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateGroupDTO {
    @ApiProperty({ description: 'Название грппы политики' })
    @IsString()
    @IsNotEmpty()
    name: string;
}
