import { BadRequestException, Injectable } from '@nestjs/common';
import { ExternalUserPayload } from '../domain/dto/external-user.dto';
import { Role, User } from '@prisma/client';
import { UserRepository } from '../../user/domain/user.repository';

@Injectable()
export class UserProvisioningService {
    constructor(private readonly userRepository: UserRepository) {}

    async provisionFromExternal(externalUser: ExternalUserPayload): Promise<User & { role: Role[] }> {
        if (!externalUser.uidNumber) {
            throw new BadRequestException('External user must have a uidNumber (ldap_tab_num)');
        }

        return await this.userRepository.upsertProvisionedUser({
            uidNumber: externalUser.uidNumber,
            firstName: externalUser.firstName || 'Unknown',
            middleName: externalUser.middleName || '',
            politicsGroups: externalUser.departments ?? [],
        });
    }
}
