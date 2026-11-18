import { Injectable } from '@nestjs/common';
import { NodeType } from '@prisma/client';
import { NodeTreeRepository } from '../domain/node-tree.repository';

@Injectable()
export class NodeTreeService {
    constructor(private readonly nodeTreeRepository: NodeTreeRepository) {}

    async validateParent(parentId: string | null): Promise<{ isValid: boolean; error?: string }> {
        if (!parentId) return { isValid: true };

        const parent = await this.nodeTreeRepository.getParentInfo(parentId);

        if (!parent) {
            return { isValid: false, error: `Родительская директория с id: ${parentId} не найдена` };
        }

        if (parent.type !== NodeType.DIRECTORY) {
            return { isValid: false, error: `Родительская директория должна быть типа ${NodeType.DIRECTORY}` };
        }

        return { isValid: true };
    }
}
