import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class SwitchRoleDto {
    @ApiProperty({ example: 'Admin' })
    @IsString()
    @IsNotEmpty()
    requireRole: string;
}