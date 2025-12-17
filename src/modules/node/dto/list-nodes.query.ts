import { IsOptional, IsUUID } from "class-validator";

export class ListNodesQueryDto {
    @IsOptional()
    @IsUUID()
    parentId?: string
}