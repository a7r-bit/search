import { ApiParam, ApiProperty } from "@nestjs/swagger"
import { IsString, MinLength, MaxLength, IsOptional } from "class-validator"

export class UpdateNodeDto {

    @ApiProperty({ description: "Название Node", nullable: true })
    @IsOptional()
    @IsString()
    @MinLength(1)
    @MaxLength(255)
    name?: string

    @ApiProperty({ description: "Описание Node", nullable: true })
    @IsOptional()
    @IsString()
    @MaxLength(2000)
    description?: string | null
}