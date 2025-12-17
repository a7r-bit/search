import { BadRequestException, Injectable, NotFoundException, NotImplementedException } from '@nestjs/common';
import { PathPart, PrismaService } from 'src/modules';
import { CreateNodeDto } from './dto/create-node.dto';
import { NodeType } from '@prisma/client';
import { UpdateNodeDto } from './dto/update-node.dto';
import { toNodeDto } from './dto/node.mapper';
import { NodeDto } from './dto/node.dto';

@Injectable()
export class NodeService {
    constructor(private readonly prisma: PrismaService) { }

    async create(dto: CreateNodeDto): Promise<NodeDto> {
        await this.validateParent(dto.parentId ?? null);
        const created = await this.prisma.node.create({
            data: {
                name: dto.name,
                type: dto.type,
                parentId: dto.parentId ?? null,
                description: dto.description ?? null,
            }
        })
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

        // parts.unshift({ id: null, name: '...' });

        return parts;
    }


    async listChildren(parentId: string | null): Promise<NodeDto[]> {
        const nodes = await this.prisma.node.findMany({
            where: {
                parentId: parentId ? parentId : null
            },
            orderBy: [{ type: 'asc' }, { name: "asc" }],
            select: {
                id: true,
                type: true,
                name: true,
                description: true,
                parentId: true,
                createdAt: true,
                updatedAt: true,
            },

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

        return toNodeDto(moved)
    }

    async delete(id: string) {
        const node = await this.prisma.node.findUnique({ where: { id }, include: { documentVersions: true } });
        if (!node) {
            throw new NotFoundException(`Директория с id: ${id} не найдена`);
        }
        throw new NotImplementedException("Удаление для связанных сущностей не реализованно")

        return toNodeDto(node);
    }



    /*
    *   helpers
    */

    private async isUnique(parentId, nodeName): Promise<boolean> {
        const unique = await this.prisma.node.findFirst({ where: { name: nodeName, parentId: parentId } });
        return unique ? false : true
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
