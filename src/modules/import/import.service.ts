import { BadRequestException, Injectable } from '@nestjs/common';
import { readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { PrismaService } from '../prisma';
import { NodeService } from '../node';
import { DocumentVersionService } from '../document-version';
import { NodeType } from '@prisma/client';

@Injectable()
export class ImportService {
    fsPath: string;
    constructor(
        private readonly prisma: PrismaService,
        private readonly nodeService: NodeService,
        private readonly documentVersionService: DocumentVersionService,
    ) {}

    async importDirectory(fsPath: string, parentNodeId?: string) {
        const stats = await stat(fsPath);
        if (!stats.isDirectory()) {
            throw new BadRequestException('Указанный путь не является директорией');
        }
        const items = await readdir(fsPath, { withFileTypes: true });

        for (const item of items) {
            if (item.isDirectory()) {
                const directoryNode = await this.nodeService.create({
                    type: NodeType.DIRECTORY,
                    name: item.name,
                    parentId: parentNodeId ?? null,
                });

                await this.importDirectory(path.join(fsPath, item.name), directoryNode.id);
                continue;
            }

            if (item.isFile() && ['.doc', '.pdf', '.docx'].includes(path.extname(item.name).toLowerCase())) {
                const ext = path.extname(item.name);
                const nameWithoutExt = path.basename(item.name, ext);

                const documentNode = await this.nodeService.create({
                    parentId: parentNodeId,
                    type: NodeType.DOCUMENT,
                    name: nameWithoutExt,
                });
                const documentVersion = await this.documentVersionService.createFromPath(
                    { nodeId: documentNode.id },
                    path.join(fsPath, item.name),
                );
                continue;
            }
        }

        return true;
    }
}
