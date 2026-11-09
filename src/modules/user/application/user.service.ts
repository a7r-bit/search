import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from '../presentation/dto/create-user.dto';
import { UpdateUserDto } from '../presentation/dto/update-user.dto';
import { User } from '@prisma/client';
import { UserRepository } from '../domain/user.repository';

@Injectable()
export class UserService {
    constructor(private readonly userRepository: UserRepository) {}

    async findAll(): Promise<User[]> {
        return await this.userRepository.findMany();
    }

    async findOne(id: string): Promise<User> {
        const user = await this.userRepository.findOne(id);

        if (!user) {
            throw new BadRequestException('Пользователь не найден');
        }

        return user;
    }

    async findByTubNumber(tabNum: string): Promise<User> {
        const user = await this.userRepository.findByTabNumber(tabNum);

        return user;
    }

    async create(createUserDto: CreateUserDto): Promise<User> {
        const isExist = await this.userRepository.findOne(createUserDto.uidNumber);
        if (isExist) throw new BadRequestException(`Пользователь с ${createUserDto.uidNumber} уже существует`);
        const user = await this.userRepository.create({
            firstName: createUserDto.firstName,
            middleName: createUserDto.middleName,
            groups: createUserDto.groups,
            uidNumber: createUserDto.uidNumber,
            roles: createUserDto.roles,
        });
        return user;
    }

    async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
        const user = await this.userRepository.findOne(id);
        if (user.uidNumber !== updateUserDto.uidNumber) {
            const isExist = await this.userRepository.findByTabNumber(updateUserDto.uidNumber);
            if (isExist) throw new BadRequestException(`Пользователь с ${updateUserDto.uidNumber} уже существует`);
        }
        return await this.userRepository.update(id, updateUserDto);
    }

    async remove(id: string): Promise<User> {
        const user = await this.userRepository.findOne(id);

        if (!user) {
            throw new BadRequestException('Пользователь не найден');
        }

        return await this.userRepository.remove(id);
    }
}
