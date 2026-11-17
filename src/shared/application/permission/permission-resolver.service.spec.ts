import { Test, TestingModule } from '@nestjs/testing';
import { NodePermissionType } from '@prisma/client';
import { PermissionResolverService } from './permission-resolver.service';
import { NodeTreeRepository } from '../../../modules/node/domain/node-tree.repository';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';

describe('PermissionResolverService', () => {
    let service: PermissionResolverService;
    let nodeAccessFindMany: jest.Mock;
    let getParent: jest.Mock;

    beforeEach(async () => {
        nodeAccessFindMany = jest.fn();
        getParent = jest.fn();

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                PermissionResolverService,
                { provide: NodeTreeRepository, useValue: { getParent } },
                { provide: PrismaService, useValue: { nodeAccess: { findMany: nodeAccessFindMany } } },
            ],
        }).compile();

        service = module.get<PermissionResolverService>(PermissionResolverService);
    });

    it('returns READ when neither the node nor its parent has policies (open node)', async () => {
        // child-1 без политик → parent root без политик → выше корня → [READ]
        nodeAccessFindMany.mockResolvedValue([]);
        getParent.mockImplementation((id: string) => (id === 'child-1' ? { id: 'root', parentId: null } : null));

        const result = await service.resolveNodePermissions(['g1'], 'child-1');

        expect(result).toEqual([NodePermissionType.READ]);
    });

    it('returns no permissions when the node has policies that do not match the user groups (no fall-through to parent)', async () => {
        // child-2 с чужими политиками → [] даже если родитель открыт
        nodeAccessFindMany.mockResolvedValue([
            { nodeId: 'child-2', groupId: 'g-other', permissions: [NodePermissionType.READ, NodePermissionType.WRITE] },
        ]);

        const result = await service.resolveNodePermissions(['g1'], 'child-2');

        expect(result).toEqual([]);
        expect(getParent).not.toHaveBeenCalled();
    });

    it('returns permissions of the matching policy', async () => {
        nodeAccessFindMany.mockResolvedValue([{ nodeId: 'child-2', groupId: 'g1', permissions: [NodePermissionType.READ] }]);

        const result = await service.resolveNodePermissions(['g1'], 'child-2');

        expect(result).toEqual([NodePermissionType.READ]);
    });

    it('inherits restriction from parent when the node itself has no policies', async () => {
        // child без политик, parent-1 с чужими политиками → []
        nodeAccessFindMany.mockImplementation(({ where }: { where: { nodeId: string } }) =>
            where.nodeId === 'child' ? [] : [{ nodeId: 'parent-1', groupId: 'g-other', permissions: [NodePermissionType.READ] }],
        );
        getParent.mockImplementation((id: string) => (id === 'child' ? { id: 'parent-1', parentId: null } : null));

        const result = await service.resolveNodePermissions(['g1'], 'child');

        expect(result).toEqual([]);
    });

    it('returns READ for null nodeId (above root)', async () => {
        const result = await service.resolveNodePermissions(['g1'], null);

        expect(result).toEqual([NodePermissionType.READ]);
    });
});
