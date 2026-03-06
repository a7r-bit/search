import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString, IsUUID } from "class-validator";
import { NodeType } from "@prisma/client";

export class ListNodesQueryDto {
    @ApiProperty({ description: "Node Id родительской Node" })
    @IsOptional()
    @IsUUID()
    parentId?: string

    @IsOptional()
    @IsString()
    type?: NodeType








}