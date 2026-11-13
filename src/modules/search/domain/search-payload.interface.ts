export interface SearchIndexPayload {
    externalId: string;
    kind: string;
    title: string;
    content?: string;
    parentId?: string;
    createdAt?: string;
}

export interface SearchDeletePayload {
    externalId: string;
    kind: string;
}
