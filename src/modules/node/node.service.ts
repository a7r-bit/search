import { BadRequestException, Injectable, NotFoundException, NotImplementedException } from '@nestjs/common';
import { CreateNodeDto } from './dto/create-node.dto';
import { UpdateNodeDto } from './dto/update-node.dto';
import { toNodeDto } from './dto/node-dto.mapper';
import { NodeDto } from './dto/node.dto';
import { PrismaService } from '../prisma';
import { DocumentVersionService } from '../document-version';
import { ElasticTypes } from '../../common/constants';
import { instanceToPlain } from 'class-transformer';
import { SortingParam } from '../../common/decorators/sorting-params.decorator';
import { PathPart } from '../../common/types/path-part.dto';
import { Node, NodePermissionType, NodeType, Prisma, User } from '@prisma/client';
import { ListNodesQueryDto, toNodeWithPermissionsDto } from './dto';
import { PoliticService } from '../politic/politic.service';
import { NodeWithPermissionsDto } from './dto/node-with-permissions.dto';
import { RequestUser } from '../../common/types/request-user';
import { NodeIndexProps } from '../../common/elasic-search-models';
import { ElasticSearchProducer } from '../bullmq/queues/elasticsearch/elasticsearch.producer';
import { PaginateResult, paginator } from '../../common/paginator/paginator';

const paginate = paginator({ perPage: 10 });

@Injectable()
export class NodeService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly documentVersionService: DocumentVersionService,
        private readonly politicService: PoliticService,
        private readonly esProducer: ElasticSearchProducer,
    ) {}

    async findMany({
        where,
        orderBy,
        page = 1,
        perPage = 10,
    }: {
        where?: Prisma.NodeWhereInput;
        orderBy?: Prisma.NodeOrderByWithRelationInput;
        page?: number;
        perPage?: number;
    }): Promise<PaginateResult<Node>> {
        return paginate(this.prisma.node, { where, orderBy }, { page, perPage });
    }

    async create(dto: CreateNodeDto): Promise<NodeDto> {
        await this.validateParent(dto.parentId ?? null);
        await this.isUnique(dto);
        const created = await this.prisma.node.create({
            data: {
                name: dto.name,
                type: dto.type,
                parentId: dto.parentId ?? null,
                description: dto.description ?? null,
            },
        });

        await this.esProducer.indexAsync(
            ElasticTypes.Node,
            created.id,
            instanceToPlain<NodeIndexProps>({
                name: created.name,
                type: created.type,
                description: created.description,
                parentId: created.parentId,
            }),
        );
        return toNodeDto(created);
    }

    async findById(id: string): Promise<NodeDto> {
        const node = await this.prisma.node.findUnique({ where: { id } });
        if (!node) {
            throw new NotFoundException(`Директория не найдена`);
        }
        return toNodeDto(node);
    }

    async getPath(id: string | null): Promise<PathPart[]> {
        const parts: PathPart[] = [];

        let currentId = id;

        while (currentId) {
            const node = await this.prisma.node.findUnique({
                where: { id: currentId },
                select: { id: true, name: true, parentId: true },
            });

            if (!node) break;

            parts.unshift({ id: node.id, name: node.name });
            currentId = node.parentId;
        }

        parts.unshift({ id: null, name: '...' });

        return parts;
    }

    async getRootPath(): Promise<PathPart[]> {
        const parts: PathPart[] = [];
        parts.unshift({ id: null, name: '...' });
        return parts;
    }

    async listChildren(query: ListNodesQueryDto, userReq: RequestUser, sort?: SortingParam): Promise<NodeWithPermissionsDto[]> {
        const { parentId, type } = query;
        const result: NodeWithPermissionsDto[] = [];
        const isOwner = userReq.activeRole === 'Owner';

        const nodes = await this.prisma.node.findMany({
            where: {
                parentId: parentId ? parentId : null,
                ...(type && { type }),
            },
            orderBy: sort ? { [sort.property]: sort.direction } : { createdAt: 'desc' },
        });

        for (const node of nodes) {
            let permissions: NodePermissionType[];

            if (isOwner) {
                permissions = Object.values(NodePermissionType);
            } else {
                permissions = await this.politicService.resolveNodePermissions(userReq.politicGroups, node.id);
            }
            result.push(toNodeWithPermissionsDto(toNodeDto(node), permissions));
        }

        return result;
    }

    async update(id: string, dto: UpdateNodeDto): Promise<NodeDto> {
        const node = await this.prisma.node.findUnique({
            where: { id },
        });

        if (!node) throw new NotFoundException('Директория не найдена');

        const updated = await this.prisma.node.update({
            where: { id },
            data: {
                name: dto.name,
                description: dto.description,
            },
        });

        await this.esProducer.indexAsync(
            ElasticTypes.Node,
            updated.id,
            instanceToPlain<NodeIndexProps>({
                name: updated.name,
                type: updated.type,
                description: updated.description,
                parentId: updated.parentId,
            }),
        );

        return toNodeDto(updated);
    }

    async move(id: string, newParentId: string | null): Promise<NodeDto> {
        const node = await this.prisma.node.findUnique({
            where: { id },
        });

        if (!node) throw new NotFoundException('Директория не найдена');

        if (newParentId === id) {
            throw new BadRequestException('Нельзя переместить в себя');
        }

        await this.validateParent(newParentId);

        if (newParentId) {
            const isDescendant = await this.isDescendant(newParentId, id);

            if (isDescendant) {
                throw new BadRequestException('Нельзя переместить директорию в свою же поддиректорию');
            }
        }

        const moved = await this.prisma.node.update({
            where: { id },
            data: { parentId: newParentId },
        });

        await this.esProducer.indexAsync(
            ElasticTypes.Node,
            moved.id,
            instanceToPlain<NodeIndexProps>({
                name: moved.name,
                type: moved.type,
                description: moved.description,
                parentId: moved.parentId,
            }),
        );

        return toNodeDto(moved);
    }

    async delete(id: string) {
        const node = await this.prisma.node.findUnique({
            where: { id },
            include: { children: true },
        });
        if (!node) {
            throw new NotFoundException(`Директория с id: ${id} не найдена`);
        }

        for (const childNode of node.children) {
            await this.delete(childNode.id);
        }

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

        const deleteNode = await this.prisma.node.delete({ where: { id } });
        try {
            await this.esProducer.deleteAsync(ElasticTypes.Node, node.id);
        } catch (_) {}
        return toNodeDto(deleteNode);
    }

    /**
     *  helpers
     */

    private async isUnique(dto: CreateNodeDto) {
        const existing = await this.prisma.node.findFirst({
            where: {
                name: dto.name,
                type: dto.type,
                parentId: dto.parentId ? dto.parentId : { equals: null },
            },
            select: { id: true },
        });

        if (existing) {
            throw new BadRequestException(`В текущей дикеткории уже существоет элемент с название: ${dto.name}`);
        }
    }

    private async isDescendant(candidateId: string, ancestorId: string): Promise<boolean> {
        let currentId: string | null = candidateId;
        const visited = new Set<string>();
        while (currentId) {
            if (currentId === ancestorId) return true;

            if (visited.has(currentId)) break;
            visited.add(currentId);

            const current = await this.prisma.node.findUnique({
                where: { id: currentId },
                select: { parentId: true },
            });
            currentId = current?.parentId ?? null;
        }
        return false;
    }

    private async validateParent(parentId: string | null) {
        if (!parentId) return;
        const parent = await this.prisma.node.findUnique({
            where: { id: parentId },
            select: { id: true, type: true },
        });
        if (!parent) {
            throw new NotFoundException('Родительская директория не найдена');
        }
        if (parent.type !== NodeType.DIRECTORY) {
            throw new BadRequestException(`Родительская директория должна быть типа ${NodeType.DIRECTORY}`);
        }
    }
}
