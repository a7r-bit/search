import { NodeType } from '@prisma/client';

export interface NodeIndexProps {
    type: NodeType;
    parentId?: string;
    name: string;
    description?: string;
}
