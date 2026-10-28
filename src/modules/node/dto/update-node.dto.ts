import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength, MaxLength, IsOptional, IsUUID } from 'class-validator';

export class UpdateNodeDto {
    @ApiProperty({ description: 'Название Node', nullable: true })
    @IsOptional()
    @IsString()
    @MinLength(1)
    @MaxLength(255)
    name?: string;

    @ApiProperty({ description: 'Описание Node', nullable: true })
    @IsOptional()
    @IsString()
    @MaxLength(2000)
    description?: string | null;

    @ApiProperty({ description: 'UUID родителя', nullable: true })
    @IsOptional()
    @IsString()
    @IsUUID()
    parentId?: string;
}
