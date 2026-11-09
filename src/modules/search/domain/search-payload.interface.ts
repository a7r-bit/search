export interface SearchIndexPayload {
    externalId: string;
    kind: string;
    title: string;
    content: string;
    parentId: string;
    createdAt: string;
}
export interface SearchUpdatePayload {
    title: string;
    content: string;
    parentId: string;
}

export interface SearchDeletePayload {
    externalId: string;
    kind: string;
}
