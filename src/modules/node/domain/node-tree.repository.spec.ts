import { Test, TestingModule } from '@nestjs/testing';
import { NodeTreeRepository } from './node-tree.repository';
import { PrismaService } from '../../../shared/infrastructure/prisma/prisma.service';
import { NodeType } from '@prisma/client';

describe('NodeTreeRepository', () => {
    let repository: NodeTreeRepository;
    let prisma: { node: { findUnique: jest.Mock }; $queryRaw: jest.Mock };

    beforeEach(async () => {
        prisma = {
            node: {
                findUnique: jest.fn(),
            },
            $queryRaw: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                NodeTreeRepository,
                { provide: PrismaService, useValue: prisma },
            ],
        }).compile();

        repository = module.get<NodeTreeRepository>(NodeTreeRepository);
    });

    it('should be defined', () => {
        expect(repository).toBeDefined();
    });

    describe('validateParent', () => {
        it('returns valid for null parentId (root node)', async () => {
            const result = await repository.validateParent(null);

            expect(result).toEqual({ isValid: true });
            expect(prisma.node.findUnique).not.toHaveBeenCalled();
        });

        it('returns valid for existing DIRECTORY parent', async () => {
            prisma.node.findUnique.mockResolvedValue({ id: 'parent-1', type: NodeType.DIRECTORY });

            const result = await repository.validateParent('parent-1');

            expect(result).toEqual({ isValid: true });
        });

        it('returns invalid for non-DIRECTORY parent', async () => {
            prisma.node.findUnique.mockResolvedValue({ id: 'parent-1', type: NodeType.DOCUMENT });

            const result = await repository.validateParent('parent-1');

            expect(result.isValid).toBe(false);
            expect(result.error).toContain(NodeType.DIRECTORY);
        });
    });

    describe('getAncestorChain', () => {
        it('uses parent_id column in SQL and returns chain ids', async () => {
            prisma.$queryRaw.mockImplementation((strings: TemplateStringsArray) => {
                const sql = strings.join('');
                expect(sql).toContain('parent_id');
                expect(sql).not.toContain('parent_of');
                return Promise.resolve([{ id: 'root-id' }, { id: 'node-id' }]);
            });

            const chain = await repository.getAncestorChain('node-id');

            expect(chain).toEqual(['root-id', 'node-id']);
        });
    });
});
