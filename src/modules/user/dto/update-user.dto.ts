import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { type Role } from '@prisma/client';
import { IsOptional, IsString } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {

}
