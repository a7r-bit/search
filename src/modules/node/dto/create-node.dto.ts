import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsOptional, IsString, IsUUID, MaxLength, MinLength } from "class-validator";
import { NodeType } from "@prisma/client";

export class CreateNodeDto {
    @ApiProperty({ description: "Тип node", enum: NodeType })
    @IsEnum(NodeType)
    type: NodeType

    @ApiProperty({ description: "Id родителя" })
    @IsOptional()
    @IsUUID()
    parentId?: string | null

    @ApiProperty({ description: "Название" })
    @IsString()
    @MinLength(1)
    @MaxLength(255)
    name: string

    @ApiProperty({ description: "Описание" })
    @IsOptional()
    @IsString()
    @MaxLength(2000)
    description?: string | null

}