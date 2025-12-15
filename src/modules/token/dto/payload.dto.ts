import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsUUID } from "class-validator";

export class PayloadDTO {
    @IsString()
    @IsNotEmpty()
    @IsUUID()
    id: string

    @IsString()
    activeRole: string
}