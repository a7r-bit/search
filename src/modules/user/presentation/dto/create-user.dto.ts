import { IsNotEmpty, IsString, IsArray, IsOptional } from 'class-validator';
import { Role } from '@prisma/client';

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
    roles?: Role[];
}
