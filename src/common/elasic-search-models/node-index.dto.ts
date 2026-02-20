
import { NodeType } from "prisma/generated/prisma/enums";

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