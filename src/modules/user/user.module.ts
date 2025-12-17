import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { RoleModule } from '../role';
import { PrismaModule } from '../prisma';

@Module({
  imports: [RoleModule, PrismaModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService,]
})
export class UserModule { }
