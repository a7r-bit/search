import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNotEmpty, IsString, IsUUID } from "class-validator";

export class PayloadDTO {
    @IsString()
    @IsNotEmpty()
    @IsUUID()
    id: string

    @IsString()
    activeRole: string

    @IsArray()
    @IsString({ each: true })
    politicGroups: string[]
}