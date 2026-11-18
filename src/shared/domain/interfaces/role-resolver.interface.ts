import { RoleBasic, RoleWithPermissions } from '../types/role-with-permissions';

export const ROLE_RESOLVER = Symbol();

export interface RoleResolver {
    getRoleWithPermissions(name: string): Promise<RoleWithPermissions>;
    getRoleByUserId(userId: string): Promise<RoleBasic[]>;
}
