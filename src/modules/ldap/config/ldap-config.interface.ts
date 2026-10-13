export interface LdapConfig {
    host: string;
    port: number;
    adminDn: string;
    adminPassword: string;
    usersDn: string;
    searchFilter: string;
    tlsEnabled: boolean;
}
