import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class SignInDto {
    @ApiProperty({ example: "1000", description: "Табельный номер пользователя" })
    @IsString()
    @IsNotEmpty()
    username: string;

    @ApiProperty({ example: "12345", description: "Пароль пользователя" })
    @IsString()
    @IsNotEmpty()
    password: string;
}