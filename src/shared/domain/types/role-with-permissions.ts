export interface RoleWithPermissions {
    id: string;
    name: string;
    permissions: { id: string; name: string }[];
}

export interface RoleBasic {
    id: string;
    name: string;
}
