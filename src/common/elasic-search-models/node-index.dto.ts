import { NodeType } from "@prisma/client";


export class NodeIndexDTO {
    constructor(type: NodeType, parentId: string | null, name: string, description: string | null) {
        this.type = type
        this.name = name
        this.description = description
        this.parentId = parentId
    }

    type: NodeType;
    parentId: string | null;
    name: string;
    description: string | null;



}