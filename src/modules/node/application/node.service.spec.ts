import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { NodeService } from './node.service';
import { NodeRepository } from '../domain/node.repository';
import { NodeTreeRepository } from '../domain/node-tree.repository';
import { DocumentVersionService } from '../../document-version/application/document-version.service';
import { PermissionResolverService } from '../../../shared/application/permission/permission-resolver.service';
import { NodeType } from '@prisma/client';

describe('NodeService', () => {
    let service: NodeService;
    let nodeRepository: { create: jest.Mock; isUnique: jest.Mock };
    let nodeTreeRepository: { validateParent: jest.Mock };

    beforeEach(async () => {
        nodeRepository = { create: jest.fn(), isUnique: jest.fn() };
        nodeTreeRepository = { validateParent: jest.fn() };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                NodeService,
                { provide: NodeRepository, useValue: nodeRepository },
                { provide: NodeTreeRepository, useValue: nodeTreeRepository },
                { provide: DocumentVersionService, useValue: {} },
                { provide: PermissionResolverService, useValue: {} },
            ],
        }).compile();

        service = module.get<NodeService>(NodeService);
    });

    describe('create', () => {
        it('creates node when name is free', async () => {
            nodeTreeRepository.validateParent.mockResolvedValue({ isValid: true });
            nodeRepository.isUnique.mockResolvedValue(true);
            const created = {
                id: 'n1',
                type: NodeType.DIRECTORY,
                parentId: null,
                name: 'Корень1',
                description: null,
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            nodeRepository.create.mockResolvedValue(created);

            const result = await service.create({ type: NodeType.DIRECTORY, name: 'Корень1', parentId: null });

            expect(nodeRepository.create).toHaveBeenCalledWith(expect.objectContaining({ name: 'Корень1' }));
            expect(result.id).toBe('n1');
        });

        it('throws BadRequestException when name is taken in the same parent', async () => {
            nodeTreeRepository.validateParent.mockResolvedValue({ isValid: true });
            nodeRepository.isUnique.mockResolvedValue(false);

            await expect(service.create({ type: NodeType.DIRECTORY, name: 'Корень1' })).rejects.toThrow(
                BadRequestException,
            );
            expect(nodeRepository.create).not.toHaveBeenCalled();
        });
    });
});
