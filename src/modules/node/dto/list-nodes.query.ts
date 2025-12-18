import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsUUID } from "class-validator";

export class ListNodesQueryDto {
    @ApiProperty({ description: "Node Id родительской Node" })
    @IsOptional()
    @IsUUID()
    parentId?: string
}