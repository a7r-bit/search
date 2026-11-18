import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { NodeService } from './node.service';
import { NodeTreeService } from './node-tree.service';
import { NodeRepository } from '../domain/node.repository';
import { NodeTreeRepository } from '../domain/node-tree.repository';
import { DocumentVersionService } from '../../document-version/application/document-version.service';
import { PermissionResolverService } from '../../../shared/application/permission/permission-resolver.service';
import { NodePermissionType, NodeType } from '@prisma/client';
import { RequestUser } from '../../../shared/domain/types/request-user';

describe('NodeService', () => {
    let service: NodeService;
    let nodeRepository: { create: jest.Mock; isUnique: jest.Mock; listChildren: jest.Mock };
    let nodeTreeRepository: Record<string, never>;
    let nodeTreeService: { validateParent: jest.Mock };
    let permissionResolverService: { resolveNodePermissions: jest.Mock };

    beforeEach(async () => {
        nodeRepository = { create: jest.fn(), isUnique: jest.fn(), listChildren: jest.fn() };
        nodeTreeRepository = {};
        nodeTreeService = { validateParent: jest.fn() };
        permissionResolverService = { resolveNodePermissions: jest.fn().mockResolvedValue([]) };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                NodeService,
                { provide: NodeRepository, useValue: nodeRepository },
                { provide: NodeTreeRepository, useValue: nodeTreeRepository },
                { provide: NodeTreeService, useValue: nodeTreeService },
                { provide: DocumentVersionService, useValue: {} },
                { provide: PermissionResolverService, useValue: permissionResolverService },
            ],
        }).compile();

        service = module.get<NodeService>(NodeService);
    });

    describe('create', () => {
        it('creates node when name is free', async () => {
            nodeTreeService.validateParent.mockResolvedValue({ isValid: true });
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
            nodeTreeService.validateParent.mockResolvedValue({ isValid: true });
            nodeRepository.isUnique.mockResolvedValue(false);

            await expect(service.create({ type: NodeType.DIRECTORY, name: 'Корень1' })).rejects.toThrow(BadRequestException);
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

        it('returns all children with resolved permissions for non-owner when parent is readable', async () => {
            nodeRepository.listChildren.mockResolvedValue([childNode]);
            permissionResolverService.resolveNodePermissions.mockImplementation((_groups: string[], nodeId: string) =>
                nodeId === 'parent-1' ? ['READ'] : ['READ'],
            );

            const result = await service.listChildren({ parentId: 'parent-1' }, limitedUser, undefined);

            expect(permissionResolverService.resolveNodePermissions).toHaveBeenCalledWith(['g1'], 'child-1');
            expect(result).toHaveLength(1);
            expect(result[0].id).toBe('child-1');
            expect(result[0].permissions).toEqual(['READ']);
        });

        it('throws ForbiddenException when user has no READ on the parent directory', async () => {
            permissionResolverService.resolveNodePermissions.mockResolvedValue([]);

            await expect(service.listChildren({ parentId: 'parent-1' }, limitedUser, undefined)).rejects.toThrow(ForbiddenException);
            expect(nodeRepository.listChildren).not.toHaveBeenCalled();
        });

        it('returns roots for non-owner without parent check', async () => {
            nodeRepository.listChildren.mockResolvedValue([childNode]);
            permissionResolverService.resolveNodePermissions.mockResolvedValue(['READ']);

            const result = await service.listChildren({}, limitedUser, undefined);

            // без parentId проверка родителя не делается — только права детей
            expect(permissionResolverService.resolveNodePermissions).toHaveBeenCalledTimes(1);
            expect(permissionResolverService.resolveNodePermissions).toHaveBeenCalledWith(['g1'], 'child-1');
            expect(result).toHaveLength(1);
        });

        it('returns all permissions for owner without resolver call', async () => {
            nodeRepository.listChildren.mockResolvedValue([childNode]);

            const result = await service.listChildren({ parentId: 'parent-1' }, ownerUser, undefined);

            expect(permissionResolverService.resolveNodePermissions).not.toHaveBeenCalled();
            expect(result).toHaveLength(1);
            expect(result[0].permissions).toEqual(Object.values(NodePermissionType));
        });
    });
});
