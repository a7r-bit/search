import { BadRequestException, Injectable, NotFoundException, NotImplementedException } from '@nestjs/common';
import { toNodeDto } from '../presentation/dto/node-dto.mapper';
import { NodeDto } from '../presentation/dto/node.dto';
import { DocumentVersionService } from '../../document-version/application/document-version.service';
import { CreateNodeDto } from '../presentation/dto/create-node.dto';
import { ListNodesQueryDto } from '../presentation/dto/list-nodes.query';
import { UpdateNodeDto } from '../presentation/dto/update-node.dto';
import { NodeRepository } from '../domain/node.repository';
import { NodeTreeRepository } from '../domain/node-tree.repository';
import { NodePermissionType, NodeType } from '@prisma/client';
import { RequestUser } from '../../../shared/domain/types/request-user';
import { SortingParam } from '../../../shared/presentation/decorators/sorting-params.decorator';
import { TreeItemDto } from '../presentation/dto/tree-item.dto';
import { PermissionResolverService } from '../../../shared/application/permission/permission-resolver.service';
import { PathPart } from '../../../shared/domain/types/path-part.dto';

@Injectable()
export class NodeService {
    constructor(
        private readonly documentVersionService: DocumentVersionService,
        private readonly nodeRepository: NodeRepository,
        private readonly nodeTreeRepository: NodeTreeRepository,
        private readonly permissionResolverService: PermissionResolverService,
    ) {}

    async getPath(id: string): Promise<PathPart[]> {
        return await this.nodeTreeRepository.getPath(id);
    }
    async findById(id: string): Promise<NodeDto> {
        return await this.nodeRepository.findByIdOrThrow(id);
    }

    async create(dto: CreateNodeDto): Promise<NodeDto> {
        const validateObj = await this.nodeTreeRepository.validateParent(dto.parentId ?? null);
        if (!validateObj.isValid) throw new BadRequestException(validateObj.error);
        await this.isUnique(dto.name, dto.type, dto.parentId ?? null);
        const created = await this.nodeRepository.create(dto);
        return toNodeDto(created);
    }

    async listChildren(query: ListNodesQueryDto, userReq: RequestUser, sort: SortingParam): Promise<TreeItemDto[]> {
        const nodes = await this.nodeRepository.listChildren(query, sort);
        const isOwner = userReq.activeRole === 'Owner';

        const childrenWithPermissions = await Promise.all(
            nodes.map(async (node) => {
                const permissions = isOwner
                    ? Object.values(NodePermissionType)
                    : await this.permissionResolverService.resolveNodePermissions(userReq.politicGroups, node.id);
                return { ...node, permissions };
            }),
        );

        return childrenWithPermissions.map((node) => this.mapToTreeItemDto(node));
    }

    private mapToTreeItemDto(node: any): TreeItemDto {
        const latest = node.documentVersions?.[0] ?? null;
        const isDirectory = node.type === NodeType.DIRECTORY;

        return {
            id: node.id,
            parentId: node.parentId ?? null,
            kind: isDirectory ? 'directory' : 'file',
            name: latest?.mediaFile?.fileName ?? node.name,
            hasChildren: isDirectory ? node._count.children > 0 : false,
            permissions: node.permissions,
            document: latest
                ? {
                      latestVersionId: latest.id,
                      version: latest.version,
                      fileName: latest.mediaFile?.fileName,
                      fileUrl: latest.mediaFile?.filePath,
                      conversionStatus: latest.conversionStatus,
                      updatedAt: latest.updatedAt,
                  }
                : null,
        };
    }

    async update(id: string, dto: UpdateNodeDto): Promise<NodeDto> {
        const node = await this.nodeRepository.findByIdOrThrow(id);
        if (dto.name) {
            await this.isUnique(dto.name, node.type, node.parentId);
        }

        const updated = await this.nodeRepository.update(id, { name: dto.name, description: dto.description });
        return toNodeDto(updated);
    }

    async move(id: string, newParentId: string | null): Promise<NodeDto> {
        await this.nodeRepository.findByIdOrThrow(id);
        const validateObj = await this.nodeTreeRepository.validateParent(newParentId);
        if (!validateObj.isValid) throw new BadRequestException(validateObj.error);

        if (newParentId === id) throw new BadRequestException('Нельзя переместить в себя');

        if (newParentId && (await this.nodeTreeRepository.isDescendant(newParentId, id))) {
            throw new BadRequestException('Нельзя переместить директорию в свою же поддиректорию');
        }

        const moved = await this.nodeRepository.update(id, { parentId: newParentId });

        return toNodeDto(moved);
    }

    async delete(id: string) {
        const node = await this.nodeRepository.findWithChildren(id);
        if (!node) {
            throw new NotFoundException(`Директория с id: ${id} не найдена`);
        }

        await this.nodeTreeRepository.recursiveDelete(id);

        switch (node.type) {
            case 'DIRECTORY':
                {
                }
                break;
            case 'DOCUMENT':
                {
                    await this.documentVersionService.removeByNodeId(node.id);
                }
                break;
            default:
                throw new NotImplementedException(`Удаление для Node типа: ${node.type} сущностей не реализованно`);
        }

        // const deleteNode = await this.prisma.node.delete({ where: { id } });
        const deleteNode = await this.nodeRepository.delete(id);
        return toNodeDto(deleteNode);
    }

    private async isUnique(name: string, type: NodeType, parentId: string | null) {
        const isUnique = await this.nodeRepository.isUnique(name, type, parentId);

        if (!isUnique) {
            throw new BadRequestException(`В текущей дикеткории уже существоет элемент с название: ${name}`);
        }
    }
}
