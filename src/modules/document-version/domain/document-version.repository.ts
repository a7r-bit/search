import { Injectable } from '@nestjs/common';
import { ConversionStatus, DocumentVersion, MediaFile, Node, Prisma } from '@prisma/client';
import { PrismaService } from '../../../shared/infrastructure/prisma/prisma.service';
import { SortingParam } from '../../../shared/presentation/decorators/sorting-params.decorator';

export type DocumentVersionWithMedia = DocumentVersion & { mediaFile: MediaFile | null };

export interface DocumentVersionFilter {
    fileName?: string;
    conversionStatus?: ConversionStatus;
}

@Injectable()
export class DocumentVersionRepository {
    constructor(private readonly prisma: PrismaService) {}

    // node-проверки
    async findNodeById(nodeId: string): Promise<Node | null> {
        return await this.prisma.node.findUnique({ where: { id: nodeId } });
    }

    // --- чтение: версии ---
    async findMany(filter?: DocumentVersionFilter): Promise<DocumentVersionWithMedia[]> {
        return await this.prisma.documentVersion.findMany({
            where: {
                ...(filter?.conversionStatus && { conversionStatus: filter.conversionStatus }),
                ...(filter?.fileName && {
                    mediaFile: { fileName: { contains: filter.fileName, mode: 'insensitive' } },
                }),
            },
            orderBy: { nodeId: 'desc' },
            include: { mediaFile: true },
        });
    }

    async findById(id: string): Promise<DocumentVersionWithMedia | null> {
        return await this.prisma.documentVersion.findFirst({
            where: { id },
            include: { mediaFile: true },
        });
    }

    async findByNodeId(nodeId: string, filter?: DocumentVersionFilter, sort?: SortingParam): Promise<DocumentVersionWithMedia[]> {
        const where: Prisma.DocumentVersionWhereInput = {
            nodeId,
            ...(filter?.conversionStatus && { conversionStatus: filter.conversionStatus }),
            ...(filter?.fileName && {
                mediaFile: { fileName: { contains: filter.fileName, mode: 'insensitive' } },
            }),
        };

        const orderBy: Prisma.DocumentVersionOrderByWithRelationInput[] = [];
        if (sort) {
            if (sort.property === 'fileName') {
                orderBy.push({
                    mediaFile: { fileName: sort.direction as Prisma.SortOrder },
                });
            } else {
                orderBy.push({ [sort.property]: sort.direction });
            }
        } else {
            orderBy.push({ version: 'asc' });
        }

        return await this.prisma.documentVersion.findMany({
            where,
            orderBy,
            include: { mediaFile: true },
        });
    }

    // --- запись: версии ---
    // Инкремент версии внутри транзакции: lastVersion + 1
    async createVersion(
        nodeId: string,
        mediaFile: { filePath: string; fileName: string; extention: string },
    ): Promise<DocumentVersionWithMedia> {
        return await this.prisma.$transaction(async (tx) => {
            const lastVersion = await tx.documentVersion.findFirst({
                where: { nodeId },
                orderBy: { version: 'desc' },
            });
            const newVersion = await tx.documentVersion.create({
                data: {
                    nodeId,
                    version: (lastVersion?.version ?? 0) + 1,
                    conversionStatus: 'PENDING',
                    mediaFile: { create: mediaFile },
                },
            });

            return await tx.documentVersion.findUniqueOrThrow({
                where: { id: newVersion.id },
                include: { mediaFile: true },
            });
        });
    }

    async isVersionUnique(nodeId: string, version: number): Promise<boolean> {
        const existing = await this.prisma.documentVersion.findUnique({
            where: {
                version_nodeId: {
                    version,
                    nodeId,
                },
            },
        });
        return existing ? false : true;
    }

    async updateVersion(id: string, data: { version: number; fileName: string }): Promise<DocumentVersionWithMedia> {
        return await this.prisma.documentVersion.update({
            where: { id },
            data: {
                version: data.version,
                mediaFile: {
                    update: {
                        fileName: data.fileName,
                    },
                },
            },
            include: {
                mediaFile: true,
            },
        });
    }

    async removeById(id: string): Promise<DocumentVersionWithMedia> {
        return await this.prisma.documentVersion.delete({
            where: { id },
            include: { mediaFile: true },
        });
    }

    // Возвращает удалённые версии (сервису нужны mediaFile для очистки хранилища и индекса)
    async removeByNodeId(nodeId: string): Promise<DocumentVersionWithMedia[]> {
        const documents = await this.prisma.documentVersion.findMany({
            where: { nodeId },
            include: { mediaFile: true },
        });
        await this.prisma.documentVersion.deleteMany({
            where: { id: { in: documents.map((doc) => doc.id) } },
        });
        return documents;
    }
}
