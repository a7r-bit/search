import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateNodeDto, DocumentVersionService, NodeService, PrismaService } from 'src/modules';
import { readdir, stat } from "node:fs/promises";
import path from 'node:path';
import { NodeType } from 'prisma/generated/prisma/enums';

@Injectable()
export class ImportService {
    fsPath: string;
    constructor(
        private readonly prisma: PrismaService,
        private readonly nodeService: NodeService,
        private readonly documentVersionService: DocumentVersionService,
    ) { }
    // async importDirectory(
    //     fsPath: string,
    //     parentNodeId?: string,
    // ): Promise<any[]> {
    //     const result: any[] = [];

    //     const items = await readdir(fsPath, { withFileTypes: true });

    //     for (const item of items) {
    //         const fullPath = path.join(fsPath, item.name);

    //         if (item.isDirectory()) {
    //             const children = await this.importDirectory(fullPath, parentNodeId);

    //             result.push({
    //                 name: item.name,
    //                 path: fullPath,
    //                 type: 'DIRECTORY',
    //                 children,
    //             });

    //             continue;
    //         }

    //         if (item.isFile()) {
    //             const ext = path.extname(item.name).toLowerCase();

    //             if (!['.doc', '.docx', '.pdf'].includes(ext)) {
    //                 continue;
    //             }

    //             result.push({
    //                 name: item.name,
    //                 path: fullPath,
    //                 type: 'DOCUMENT',
    //                 extension: ext,
    //             });
    //         }
    //     }

    //     // Node create function
    //     /*  async create(dto: CreateNodeDto): Promise<NodeDto> {
    //              await this.validateParent(dto.parentId ?? null);
    //              await this.isUnique(dto);
    //              const created = await this.prisma.node.create({
    //                  data: {
    //                      name: dto.name,
    //                      type: dto.type,
    //                      parentId: dto.parentId ?? null,
    //                      description: dto.description ?? null,
    //                  }
    //              })
    //              await this.searchService.indexDocument(ElasticTypes.Node, created.id, instanceToPlain(new NodeIndexDTO(
    //                  created.type,
    //                  created.parentId,
    //                  created.name,
    //                  created.description
    //              )))
    //              return toNodeDto(created)
    //          }*/

    //     return result;
    // }
    async importDirectory(fsPath: string,
        parentNodeId?: string,) {
        const stats = await stat(fsPath);
        if (!stats.isDirectory()) {
            throw new BadRequestException('Указанный путь не является директорией')
        }

        console.log(`📁 Вход в директорию ${fsPath}`);
        const items = await readdir(fsPath, { withFileTypes: true });

        for (const item of items) {
            if (item.isDirectory()) {
                console.log(`📁 Создание директории: ${item.name}`);
                // await createNode(...)
                const directoryNode = await this.nodeService.create({
                    type: NodeType.DIRECTORY,
                    name: item.name,
                    parentId: parentNodeId ?? null,
                })

                await this.importDirectory(path.join(fsPath, item.name), parentNodeId);
                continue
            }

            if (item.isFile() && ['.doc', '.pdf', '.docx'].includes(path.extname(item.name).toLowerCase())) {
                console.log(`📄 Создание документа: ${item.name}`);
                // await createDocument(...)
                const ext = path.extname(item.name);
                const nameWithoutExt = path.basename(item.name, ext);

                const documentNode = await this.nodeService.create({
                    parentId: parentNodeId,
                    type: NodeType.DOCUMENT,
                    name: nameWithoutExt,
                });
                const documentVersion = await this.documentVersionService.createFromPath({ nodeId: documentNode.id }, path.join(fsPath, item.name));
                continue
            }
            console.log(`⚠️ Пропуск файла ${item.name} - неподдерживаемый формат`);
        }

        return true;
    }



}
