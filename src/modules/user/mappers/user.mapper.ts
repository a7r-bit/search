import { UserDTO } from "../dto/user.dto";

export class UserMapper {
    static toDTO(user: any): UserDTO {
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
                    name: p.name
                }))
            }))
        }
    }
}