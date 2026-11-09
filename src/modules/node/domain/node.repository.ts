import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../shared/infrastructure/prisma/prisma.service';
import { CreateNodeDto } from '../presentation/dto/create-node.dto';
import { ListNodesQueryDto } from '../presentation/dto/list-nodes.query';
import { UpdateNodeDto } from '../presentation/dto/update-node.dto';
import { NodeWithChildrens } from '../presentation/dto/node.dto';
import { Node, NodeType, Prisma } from '@prisma/client';
import { SortingParam } from '../../../shared/presentation/decorators/sorting-params.decorator';

@Injectable()
export class NodeRepository {
    constructor(private readonly prisma: PrismaService) {}
    async create(dto: CreateNodeDto): Promise<Node> {
        const created = await this.prisma.node.create({
            data: {
                name: dto.name,
                type: dto.type,
                parentId: dto.parentId ?? null,
                description: dto.description ?? null,
            },
        });

        return created;
    }

    async findById(id: string): Promise<Node> {
        const node = await this.prisma.node.findUnique({ where: { id } });
        return node;
    }
    async findByIdOrThrow(id: string): Promise<Node> {
        const node = await this.prisma.node.findUnique({ where: { id } });
        if (!node) {
            throw new NotFoundException(`Директория не найдена`);
        }
        return node;
    }

    async update(id: string, dto: UpdateNodeDto): Promise<Node> {
        const updated = await this.prisma.node.update({
            where: { id },
            data: {
                name: dto.name,
                description: dto.description,
                parentId: dto.parentId,
            },
        });

        return updated;
    }

    async findWithChildren(id: string): Promise<NodeWithChildrens> {
        const node = await this.prisma.node.findUnique({ where: { id }, include: { children: true } });
        return node;
    }

    async delete(id: string): Promise<Node> {
        const deleteNode = await this.prisma.node.delete({ where: { id } });
        return deleteNode;
    }
    async deleteMany(ids: string[]): Promise<Prisma.BatchPayload> {
        const deleteNode = await this.prisma.node.deleteMany({ where: { id: { in: ids } } });
        return deleteNode;
    }

    async isUnique(name: string, type: NodeType, parentId: string | null): Promise<boolean> {
        const existing = await this.prisma.node.findFirst({
            where: {
                name: name,
                type: type,
                parentId: parentId,
            },
        });

        // Если запись не найдена, значит имя уникально (true)
        return !existing;
    }

    async listChildren(query: ListNodesQueryDto, sort?: SortingParam) {
        const { parentId, type } = query;

        return await this.prisma.node.findMany({
            where: {
                parentId: parentId ? parentId : null,
                ...(type && { type }),
            },
            include: {
                _count: { select: { children: true } },
                documentVersions: {
                    take: 1,
                    orderBy: { version: 'desc' },
                    include: { mediaFile: true },
                },
            },
            orderBy: sort ? { [sort.property]: sort.direction } : { createdAt: 'desc' },
        });
    }
}
