export interface RequestUser {
    id: string;
    uidNumber: string;
    activeRole: string;
    politicGroups: string[];
    permissions: string[];
}
