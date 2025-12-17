import { IsOptional, IsUUID } from "class-validator";

export class MoveNodeDto {
    @IsOptional()
    @IsUUID()
    newParentId?: string | null
}