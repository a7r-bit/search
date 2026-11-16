import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { NodeService } from './node.service';
import { NodeRepository } from '../domain/node.repository';
import { NodeTreeRepository } from '../domain/node-tree.repository';
import { DocumentVersionService } from '../../document-version/application/document-version.service';
import { PermissionResolverService } from '../../../shared/application/permission/permission-resolver.service';
import { PoliticService } from '../../politic/application/politic.service';
import { NodeType } from '@prisma/client';
import { RequestUser } from '../../../shared/domain/types/request-user';

describe('NodeService', () => {
    let service: NodeService;
    let nodeRepository: { create: jest.Mock; isUnique: jest.Mock; listChildren: jest.Mock };
    let nodeTreeRepository: { validateParent: jest.Mock };
    let politicService: { checkUserToNodeAccess: jest.Mock };
    let permissionResolverService: { resolveNodePermissions: jest.Mock };

    beforeEach(async () => {
        nodeRepository = { create: jest.fn(), isUnique: jest.fn(), listChildren: jest.fn() };
        nodeTreeRepository = { validateParent: jest.fn() };
        politicService = { checkUserToNodeAccess: jest.fn() };
        permissionResolverService = { resolveNodePermissions: jest.fn().mockResolvedValue([]) };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                NodeService,
                { provide: NodeRepository, useValue: nodeRepository },
                { provide: NodeTreeRepository, useValue: nodeTreeRepository },
                { provide: DocumentVersionService, useValue: {} },
                { provide: PermissionResolverService, useValue: permissionResolverService },
                { provide: PoliticService, useValue: politicService },
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

    describe('listChildren', () => {
        const childNode = {
            id: 'child-1',
            parentId: 'parent-1',
            type: NodeType.DIRECTORY,
            name: 'Папка',
            description: null,
            documentVersions: [],
            _count: { children: 0 },
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        const ownerUser: RequestUser = { id: 'u1', uidNumber: '1001', activeRole: 'Owner', politicGroups: [], permissions: [] };
        const limitedUser: RequestUser = { id: 'u2', uidNumber: '1002', activeRole: 'User', politicGroups: ['g1'], permissions: [] };

        it('returns empty list without 403 when user has no access to the parent directory', async () => {
            politicService.checkUserToNodeAccess.mockResolvedValue(false);

            const result = await service.listChildren({ parentId: 'parent-1' }, limitedUser, undefined);

            expect(result).toEqual([]);
            expect(nodeRepository.listChildren).not.toHaveBeenCalled();
        });

        it('returns children when user has access to the parent directory', async () => {
            politicService.checkUserToNodeAccess.mockResolvedValue(true);
            nodeRepository.listChildren.mockResolvedValue([childNode]);

            const result = await service.listChildren({ parentId: 'parent-1' }, limitedUser, undefined);

            expect(politicService.checkUserToNodeAccess).toHaveBeenCalledWith(['g1'], 'parent-1');
            expect(result).toHaveLength(1);
            expect(result[0].id).toBe('child-1');
        });

        it('returns children for owner without access check', async () => {
            nodeRepository.listChildren.mockResolvedValue([childNode]);

            const result = await service.listChildren({ parentId: 'parent-1' }, ownerUser, undefined);

            expect(politicService.checkUserToNodeAccess).not.toHaveBeenCalled();
            expect(result).toHaveLength(1);
        });
    });
});
