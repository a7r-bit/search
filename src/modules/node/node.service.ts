import { BadRequestException, Injectable, NotFoundException, NotImplementedException } from '@nestjs/common';
import { DocumentVersionService, ListNodesQueryDto, PrismaService, SearchService } from 'src/modules';
import { CreateNodeDto } from './dto/create-node.dto';
import { NodeType } from '@prisma/client';
import { UpdateNodeDto } from './dto/update-node.dto';
import { toNodeDto } from './dto/node.mapper';
import { NodeDto } from './dto/node.dto';
import { ElasticTypes } from 'src/common/constants';
import { instanceToPlain } from 'class-transformer';
import { NodeIndexDTO } from 'src/common/elasic-search-models';
import { PathPart } from 'src/common/path-part.dto';
import { noop } from 'rxjs';
import { SortingParam } from 'src/common/decorators/sorting-params.decorator';

@Injectable()
export class NodeService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly searchService: SearchService,
        private readonly documentVersionService: DocumentVersionService,
    ) { }

    async create(dto: CreateNodeDto): Promise<NodeDto> {
        await this.validateParent(dto.parentId ?? null);
        await this.isUnique(dto);
        const created = await this.prisma.node.create({
            data: {
                name: dto.name,
                type: dto.type,
                parentId: dto.parentId ?? null,
                description: dto.description ?? null,
            }
        })
        await this.searchService.indexDocument(ElasticTypes.Node, created.id, instanceToPlain(new NodeIndexDTO(
            created.type,
            created.parentId,
            created.name,
            created.description
        )))
        return toNodeDto(created)
    }

    async findById(id: string): Promise<NodeDto> {
        const node = await this.prisma.node.findUnique({ where: { id } })
        if (!node) {
            throw new NotFoundException(`Директория не найдена`);
        }
        return toNodeDto(node)
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
        return parts
    }


    async listChildren(query: ListNodesQueryDto, sort?: SortingParam): Promise<NodeDto[]> {
        const { parentId, type } = query;
        const nodes = await this.prisma.node.findMany({
            where: {
                parentId: parentId ? parentId : null,
                ...(type && { type }),
            },
            orderBy: sort ? { [sort.property]: sort.direction } : { createdAt: 'desc' },


        })
        return nodes.map(node => toNodeDto(node))
    }

    async update(id: string, dto: UpdateNodeDto): Promise<NodeDto> {
        const node = await this.prisma.node.findUnique({
            where: { id },
        });

        if (!node) throw new NotFoundException('Директория не найдена');

        const updated = await this.prisma.node.update({
            where: { id }, data: {
                name: dto.name,
                description: dto.description
            }
        })
        await this.searchService.updateDocument(ElasticTypes.Node, updated.id, instanceToPlain(new NodeIndexDTO(
            updated.type,
            updated.parentId,
            updated.name,
            updated.description
        )))
        return toNodeDto(updated)
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
            data: { parentId: newParentId }
        })

        await this.searchService.updateDocument(ElasticTypes.Node, moved.id, instanceToPlain(new NodeIndexDTO(
            moved.type,
            moved.parentId,
            moved.name,
            moved.description
        )))
        return toNodeDto(moved)
    }

    async delete(id: string) {
        const node = await this.prisma.node.findUnique({
            where: { id }, include: { children: true }
        });
        if (!node) {
            throw new NotFoundException(`Директория с id: ${id} не найдена`);
        }

        for (const childNode of node.children) {
            await this.delete(childNode.id);
        }

        switch (node.type) {
            case 'DIRECTORY': {

            } break;
            case 'DOCUMENT': {
                await this.documentVersionService.removeByNodeId(node.id)
            } break;
            default: throw new NotImplementedException(`Удаление для Node типа: ${node.type} сущностей не реализованно`)
        }

        const deleteNode = await this.prisma.node.delete({ where: { id } })
        try {
            await this.searchService.deleteDocument(ElasticTypes.Node, node.id);
        } catch (e) {
            console.log(e);
        }
        return toNodeDto(deleteNode)

    }


    /**
     *  helpers
     */

    private async isUnique(dto: CreateNodeDto) {

        const existing = await this.prisma.node.findFirst({
            where: {
                name: dto.name,
                type: dto.type,
                parentId: dto.parentId
                    ? dto.parentId
                    : { equals: null },
            },
            select: { id: true },
        });
        console.log({ existing: existing });

        if (existing) {
            throw new BadRequestException(`В текущей дикеткории уже существоет элемент с название: ${dto.name}`)
        }
    }


    private async isDescendant(candidateId: string, ancestorId: string): Promise<boolean> {
        let currentId: string | null = candidateId;
        const visited = new Set<string>();
        while (currentId) {
            if (currentId === ancestorId) return true

            if (visited.has(currentId)) break;
            visited.add(currentId);

            const current = await this.prisma.node.findUnique({ where: { id: currentId }, select: { parentId: true } });
            currentId = current?.parentId ?? null
        }
        return false
    }



    private async validateParent(parentId: string | null) {
        if (!parentId) return
        const parent = await this.prisma.node.findUnique({
            where: { id: parentId },
            select: { id: true, type: true }
        });
        if (!parent) {
            throw new NotFoundException('Родительская директория не найдена')
        }
        if (parent.type !== NodeType.DIRECTORY) {
            throw new BadRequestException(`Родительская директория должна быть типа ${NodeType.DIRECTORY}`)
        }
    }
}
