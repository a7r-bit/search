import { Test, TestingModule } from '@nestjs/testing';
import { NodeTreeService } from './node-tree.service';
import { NodeTreeRepository } from '../domain/node-tree.repository';
import { NodeType } from '@prisma/client';

describe('NodeTreeService', () => {
    let service: NodeTreeService;
    let nodeTreeRepository: { getParentInfo: jest.Mock };

    beforeEach(async () => {
        nodeTreeRepository = {
            getParentInfo: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [NodeTreeService, { provide: NodeTreeRepository, useValue: nodeTreeRepository }],
        }).compile();

        service = module.get<NodeTreeService>(NodeTreeService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('validateParent', () => {
        it('returns valid for null parentId (root node)', async () => {
            const result = await service.validateParent(null);

            expect(result).toEqual({ isValid: true });
            expect(nodeTreeRepository.getParentInfo).not.toHaveBeenCalled();
        });

        it('returns valid for existing DIRECTORY parent', async () => {
            nodeTreeRepository.getParentInfo.mockResolvedValue({ id: 'parent-1', type: NodeType.DIRECTORY });

            const result = await service.validateParent('parent-1');

            expect(result).toEqual({ isValid: true });
        });

        it('returns invalid when parent is not found', async () => {
            nodeTreeRepository.getParentInfo.mockResolvedValue(null);

            const result = await service.validateParent('missing-id');

            expect(result.isValid).toBe(false);
            expect(result.error).toContain('missing-id');
        });

        it('returns invalid for non-DIRECTORY parent', async () => {
            nodeTreeRepository.getParentInfo.mockResolvedValue({ id: 'parent-1', type: NodeType.DOCUMENT });

            const result = await service.validateParent('parent-1');

            expect(result.isValid).toBe(false);
            expect(result.error).toContain(NodeType.DIRECTORY);
        });
    });
});
