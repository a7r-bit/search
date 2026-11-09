import { Module } from '@nestjs/common';
import { UserProvisioningService } from './user-provisioning.service';
import { UserModule } from '../modules/user/user.module';

@Module({
    imports: [UserModule],
    providers: [UserProvisioningService],
    exports: [UserProvisioningService],
})
export class UserProvisioningModule {}
