import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import { UserWithRoles, UserWithRolesAndPermissions } from './types';
import { Prisma, User } from '../../generated/prisma/client';




@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) { }

  async findAll(): Promise<User[]>;
  async findAll(options: { includeRoles: true }): Promise<UserWithRoles[]>;
  async findAll(options: { includeRoles: true, includePermissions: true }): Promise<UserWithRolesAndPermissions[]>;
  async findAll(options?: { includeRoles?: boolean; includePermissions?: boolean }): Promise<User[] | UserWithRoles[] | UserWithRolesAndPermissions[]>;

  async findAll(
    options?: {
      includeRoles?: boolean;
      includePermissions?: boolean
    }): Promise<User[] | UserWithRoles[] | UserWithRolesAndPermissions[]> {
    const include: Prisma.UserInclude = {};

    if (options?.includeRoles) {
      include.role = {
        include: options?.includePermissions ? { permissions: true } : undefined
      }
    }

    return await this.prisma.user.findMany({
      include: Object.keys(include).length > 0 ? include : undefined
    })
  }

  async findOne(id: string): Promise<User>;
  async findOne(id: string, options: { includeRoles: true }): Promise<UserWithRoles>;
  async findOne(id: string, options: { includeRoles: true, includePermissions: true }): Promise<UserWithRolesAndPermissions>;
  async findOne(id: string, options?: { includeRoles?: boolean; includePermissions?: boolean }): Promise<User | UserWithRoles | UserWithRolesAndPermissions>;

  async findOne(
    id: string,
    options?: {
      includeRoles?: boolean,
      includePermissions?: boolean
    }
  ): Promise<User | UserWithRoles | UserWithRolesAndPermissions> {
    const include: Prisma.UserInclude = {};

    if (options?.includeRoles) {
      include.role = {
        include: options?.includePermissions ? { permissions: true } : undefined
      };
    }

    const user = await this.prisma.user.findUnique({
      where: { id },
      include: Object.keys(include).length > 0 ? include : undefined
    });

    if (!user) {
      throw new BadRequestException("Пользователь не найден");
    }

    return user;
  }

  async findByUidNumber(id: string): Promise<User>;
  async findByUidNumber(id: string, options: { includeRoles: true }): Promise<UserWithRoles>;
  async findByUidNumber(id: string, options: { includeRoles: true, includePermissions: true }): Promise<UserWithRolesAndPermissions>;
  async findByUidNumber(id: string, options?: { includeRoles?: boolean; includePermissions?: boolean }): Promise<User | UserWithRoles | UserWithRolesAndPermissions>;


  async findByUidNumber(
    uidNumber: string,
    options?: {
      includeRoles?: boolean,
      includePermissions?: boolean
    }): Promise<User | UserWithRoles | UserWithRolesAndPermissions | null> {

    const include: Prisma.UserInclude = {};


    if (options?.includeRoles) {
      include.role = {
        include: options?.includePermissions ? { permissions: true } : undefined
      }
    }

    const user = await this.prisma.user.findUnique({
      where: { uidNumber },
      include: Object.keys(include).length > 0 ? include : undefined
    })


    return user
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { firstName, middleName, uidNumber, groups, roles } = createUserDto
    const isExist = await this.prisma.user.findUnique({ where: { uidNumber } })
    if (isExist) throw new BadRequestException(`Пользователь с ${uidNumber} уже существует`)
    const user = await this.prisma.user.create({ data: { firstName, middleName, groups, uidNumber, role: { connect: roles } } })
    return user
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const { firstName, groups, middleName, uidNumber, roles } = updateUserDto
    const user = await this.findOne(id)
    if (uidNumber) {
      const isExist = await this.findByUidNumber(uidNumber)
      if (isExist) throw new BadRequestException(`Пользователь с ${uidNumber} уже существует`)
    }
    return await this.prisma.user.update({ where: { id }, data: { firstName, middleName, groups, uidNumber, role: { set: roles } } })
  }

  isEquals(user1: User, user2: any) {
    const areGroupsEqual =
      user1.groups.length === user2.groups.length &&
      user1.groups.every(group => user2.groups.includes(group));

    if (!areGroupsEqual || user1.firstName !== user2.givenName || user1.middleName !== user2.sn) {
      return false
    } else return true
  }

  async remove(id: string): Promise<User> {
    await this.findOne(id)
    return await this.prisma.user.delete({ where: { id } })
  }
}
