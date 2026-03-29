import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma';
import { toNodeDto } from '../node/dto';
@Injectable()
export class LikedNodeService {
    constructor(private readonly prisma: PrismaService) {}

    async getMyLikedNodes(userId: string) {
        const nodes = await this.prisma.likedNode.findMany({
            where: {
                userId,
            },
            orderBy: { createdAt: 'desc' },
            include: { node: true },
        });
        return nodes.map((like) => toNodeDto(like.node));
    }

    async toggleNode(userId: string, nodeId: string) {
        const node = await this.prisma.node.findUnique({
            where: { id: nodeId },
        });
        if (!node) {
            throw new NotFoundException('Узел не найден');
        }

        const existing = await this.prisma.likedNode.findUnique({
            where: { userId_nodeId: { userId, nodeId } },
            select: { id: true },
        });

        if (existing) {
            await this.prisma.likedNode.delete({
                where: { userId_nodeId: { userId, nodeId } },
            });
            return toNodeDto(node);
        }

        await this.prisma.likedNode.create({
            data: { userId, nodeId },
        });
        return toNodeDto(node);
    }
}
