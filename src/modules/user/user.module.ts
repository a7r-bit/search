import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { RoleModule } from '../role/role.module';
import { PrismaModule } from '../prisma/prisma.module';
import { UserRepository } from './user.repository';

@Module({
    imports: [RoleModule, PrismaModule],
    controllers: [UserController],
    providers: [UserService, UserRepository],
    exports: [UserService, UserRepository],
})
export class UserModule {}
