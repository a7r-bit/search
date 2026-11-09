import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../shared/infrastructure/prisma/prisma.service';
import { Role, User } from '@prisma/client';
import { CreateUserDto } from '../presentation/dto/create-user.dto';
import { UpdateUserDto } from '../presentation/dto/update-user.dto';

@Injectable()
export class UserRepository {
    constructor(private readonly prisma: PrismaService) {}

    async findMany(): Promise<User[]> {
        const users = await this.prisma.user.findMany();
        return users;
    }

    async findOne(id: string): Promise<User> {
        const user = await this.prisma.user.findUnique({ where: { id: id }, include: { role: true, politicsGroups: true } });
        return user;
    }

    async findByTabNumber(tabNumber: string): Promise<User> {
        const user = await this.prisma.user.findUnique({ where: { uidNumber: tabNumber } });
        return user;
    }

    async upsertProvisionedUser(data: {
        uidNumber: string;
        firstName: string;
        middleName: string;
        politicsGroups: { externalId: string; name: string }[];
    }): Promise<User & { role: Role[] }> {
        const connectOrCreate = data.politicsGroups.map((group) => ({
            where: { externalId: group.externalId },
            create: {
                name: group.name,
                externalId: group.externalId,
            },
        }));

        return await this.prisma.user.upsert({
            where: { uidNumber: data.uidNumber },
            update: {
                firstName: data.firstName,
                middleName: data.middleName,
                politicsGroups: { connectOrCreate },
            },
            create: {
                uidNumber: data.uidNumber,
                firstName: data.firstName,
                middleName: data.middleName,
                role: { connect: { name: 'User' } },
                politicsGroups: { connectOrCreate },
            },
            include: { role: true },
        });
    }

    async create(createUserDto: CreateUserDto): Promise<User> {
        const { firstName, middleName, uidNumber, groups, roles } = createUserDto;
        const user = await this.prisma.user.create({
            data: {
                firstName,
                middleName,
                groups,
                uidNumber,
                role: { connect: roles },
            },
        });
        return user;
    }

    async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
        const { firstName, groups, middleName, uidNumber, roles } = updateUserDto;
        return await this.prisma.user.update({
            where: { id },
            data: { firstName, middleName, groups, uidNumber, role: { set: roles } },
        });
    }

    async remove(id: string): Promise<User> {
        return await this.prisma.user.delete({ where: { id } });
    }
}
