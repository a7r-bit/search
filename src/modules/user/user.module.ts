import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { RoleModule } from '../role';

@Module({
  imports: [RoleModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService,]
})
export class UserModule { }
