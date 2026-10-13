export interface LdapUserPayload {
    uidNumber: string;
    sAMAccountName?: string;
    givenName?: string;
    sn?: string;
    mail?: string;
    displayName?: string;
    dn?: string;
}
