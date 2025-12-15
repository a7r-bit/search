import { Role } from "@prisma/client";
import { IsNotEmpty, IsString, IsArray, IsJWT, IsOptional } from "class-validator";

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
