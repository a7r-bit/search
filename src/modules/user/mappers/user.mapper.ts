import { UserDTO } from '../dto/user.dto';
import { UserWithRoles } from '../types';

export class UserMapper {
    static toUserDTO(user: UserWithRoles): UserDTO {
        return {
            id: user.id,
            uidNumber: user.uidNumber,
            firstName: user.firstName,
            middleName: user.middleName,
            roles: user.role?.map((r: any) => ({
                id: r.id,
                name: r.name,
                permissions: r.permissions?.map((p: any) => ({
                    id: p.id,
                    name: p.name,
                })),
            })),
        };
    }
}
