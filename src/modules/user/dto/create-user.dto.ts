import { IsNotEmpty, IsString, IsArray, IsJWT, IsOptional } from "class-validator";
import { Role } from "src/generated/prisma/client";

export class CreateUserDto {

    @IsString()
    @IsNotEmpty()
    uidNumber: string;

    @IsString()
    @IsNotEmpty()
    firstName: string;

    @IsString()
    @IsNotEmpty()
    middleName: string;

    @IsArray()
    @IsString({ each: true })
    groups: string[] = [];

    @IsOptional()
    roles?: Role[]


}
