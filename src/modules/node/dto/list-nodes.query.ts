import { ApiProperty } from "@nestjs/swagger";
import { NodeType } from "@prisma/client";
import { IsOptional, IsString, IsUUID } from "class-validator";

export class ListNodesQueryDto {
    @ApiProperty({ description: "Node Id родительской Node" })
    @IsOptional()
    @IsUUID()
    parentId?: string

    @IsOptional()
    @IsString()
    type?: NodeType








}