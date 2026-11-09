import { Module } from '@nestjs/common';
import { UserService } from './application/user.service';
import { UserController } from './presentation/user.controller';
import { RoleModule } from '../role/role.module';
import { PrismaModule } from '../../shared/infrastructure/prisma/prisma.module';
import { UserRepository } from './domain/user.repository';

@Module({
    imports: [RoleModule, PrismaModule],
    controllers: [UserController],
    providers: [UserService, UserRepository],
    exports: [UserService, UserRepository],
})
export class UserModule {}
