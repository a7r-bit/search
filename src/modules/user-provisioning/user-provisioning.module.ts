import { Module } from '@nestjs/common';
import { UserProvisioningService } from './application/user-provisioning.service';
import { UserModule } from '../user/user.module';

@Module({
    imports: [UserModule],
    providers: [UserProvisioningService],
    exports: [UserProvisioningService],
})
export class UserProvisioningModule {}
