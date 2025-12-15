import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator"

export class CreateDirectoryDto {
    @ApiProperty({ description: "Название директории", })
    @IsString()
    @IsNotEmpty()
    name: string

    @ApiProperty({ description: "id родительской директории" })
    @IsUUID()
    @IsOptional()
    parentId: string
}
