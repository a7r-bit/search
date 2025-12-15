import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";

export class CreateDocumentDto {

    @ApiProperty({ description: "Название документа" })
    @IsString()
    @IsNotEmpty()
    title: string


    @ApiPropertyOptional({ description: "Описание документа" })
    @IsString()
    @IsOptional()
    description?: string

    @ApiProperty({ description: "Id директории в которой находится документ" })
    @IsString()
    @IsNotEmpty()
    @IsUUID()
    directoryId: string

}
