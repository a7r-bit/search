import { IsString, MinLength, MaxLength, IsOptional } from "class-validator"

export class UpdateNodeDto {


    @IsOptional()
    @IsString()
    @MinLength(1)
    @MaxLength(255)
    name?: string

    @IsOptional()
    @IsString()
    @MaxLength(2000)
    description?: string | null
}