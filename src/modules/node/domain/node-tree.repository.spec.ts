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
            providers: [NodeTreeRepository, { provide: PrismaService, useValue: prisma }],
        }).compile();

        repository = module.get<NodeTreeRepository>(NodeTreeRepository);
    });

    it('should be defined', () => {
        expect(repository).toBeDefined();
    });

    describe('getParentInfo', () => {
        it('returns parent id and type', async () => {
            prisma.node.findUnique.mockResolvedValue({ id: 'parent-1', type: NodeType.DIRECTORY });

            const result = await repository.getParentInfo('parent-1');

            expect(result).toEqual({ id: 'parent-1', type: NodeType.DIRECTORY });
        });

        it('returns null when parent is not found', async () => {
            prisma.node.findUnique.mockResolvedValue(null);

            const result = await repository.getParentInfo('missing-id');

            expect(result).toBeNull();
        });
    });

    describe('getAncestorChain', () => {
        it('walks upward (join r.parent_id = n.id) and returns chain ids', async () => {
            prisma.$queryRaw.mockImplementation((strings: TemplateStringsArray) => {
                const sql = strings.join('');
                expect(sql).toContain('parent_id');
                expect(sql).not.toContain('parent_of');
                // обход вверх к корню: n — родитель r; не вниз (n.parent_id = r.id)
                expect(sql).toContain('r.parent_id = n.id');
                expect(sql).not.toContain('n.parent_id = r.id');
                return Promise.resolve([{ id: 'root-id' }, { id: 'node-id' }]);
            });

            const chain = await repository.getAncestorChain('node-id');

            expect(chain).toEqual(['root-id', 'node-id']);
        });
    });
});
