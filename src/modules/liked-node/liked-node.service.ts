import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/modules';
import { toNodeDto } from '../node/dto/node.mapper';

@Injectable()
export class LikedNodeService {
    constructor(private readonly prisma: PrismaService) { }

    async getMyLikedNodes(userId: string) {
        const nodes = await this.prisma.likedNode.findMany({
            where: {
                userId,
            },
            orderBy: { createdAt: "desc" },
            include: { node: true }
        })
        return nodes.map(like => toNodeDto(like.node))
    }




    async toggleNode(userId: string, nodeId: string) {
        const existing = await this.prisma.likedNode.findUnique({
            where: { userId_nodeId: { userId, nodeId } },
            select: { id: true },
        });
        if (existing) {
            throw new NotFoundException("Директория не найдена")
        }

        if (existing) {
            const result = await this.prisma.likedNode.delete({
                where: { userId_nodeId: { userId, nodeId } },
                include: { node: true }
            });
            return toNodeDto(result.node)
        }
        const result = await this.prisma.likedNode.create({
            data: { userId, nodeId },
            include: { node: true }
        });

        return toNodeDto(result.node)
    }



}
