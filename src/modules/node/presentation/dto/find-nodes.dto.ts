import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { NodeType } from '@prisma/client';
import { IsOptional, IsString } from 'class-validator';

export class FindNodeDto {
    @ApiPropertyOptional({ enum: NodeType })
    @IsOptional()
    @IsString()
    type?: NodeType;

    @ApiProperty({
        required: false,
        description: 'Поиск по имени',
    })
    @IsOptional()
    @IsString()
    search?: string;
}
