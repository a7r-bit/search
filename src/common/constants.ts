export enum AppRole {
    OWNER = 'Owner',
    ADMIN = 'Admin',
    TECHNICIAN = 'Technician',
    USER = 'User',
}

// Соответствие: LDAP-группа → Роль приложения
export const GROUP_TO_ROLE: Record<string, AppRole> = {
    [process.env['OWNER_LDAP_GROUP_NAME'] || 'owners']: AppRole.OWNER,
    [process.env['ADMIN_LDAP_GROUP_NAME'] || 'admins']: AppRole.ADMIN,
    [process.env['TECHNICIAN_LDAP_GROUP_NAME'] || 'technicians']: AppRole.TECHNICIAN,
    [process.env['USER_LDAP_GROUP_NAME'] || 'users']: AppRole.USER,
};

export const ACCESS_SECRET_KEY = process.env.ACCESS_SECRET_KEY;
export const REFRESH_SECRET_KEY = process.env.REFRESH_SECRET_KEY;
export const JWT_EXPIRES_IN_ACCESS = process.env.JWT_EXPIRES_IN_ACCESS ?? '15m';
export const JWT_EXPIRES_IN_REFRESH = process.env.JWT_EXPIRES_IN_REFRESH ?? '7d';

export enum ElasticTypes {
    Node = 'nodes',
    DocumentVersion = 'document_versions',
}
