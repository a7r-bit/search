import { Module } from '@nestjs/common';
import { UserProvisioningService } from './user-provisioning.service';
import { UserModule } from '../modules';

@Module({
    imports: [UserModule],
    providers: [UserProvisioningService],
    exports: [UserProvisioningService],
})
export class UserProvisioningModule {}
