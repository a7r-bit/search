import { Injectable } from '@nestjs/common';
import { SearchService } from '../search';
import { SearchFileDto } from './dto/search-file.dto';
import { RequestUser } from '../../common/types/request-user';
import { NodeService } from '../node';
import { GlobalSearchResponseDto } from './dto/search-response.dto';
import { DirectorySearchItemDto, FileSearchItemDto, SearchResultItemDto } from './dto/search-result-item.dto';
import { mapElasticHitToSearchItem } from './mappers/search-result.mapper';
import { PrismaService } from '../prisma';
import { PathPart } from '../../common/types/path-part.dto';

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

@Injectable()
export class GlobalSearchService {
    constructor(
        private readonly searchService: SearchService,
        private readonly nodeService: NodeService,
        private readonly prisma: PrismaService,
    ) {}

    async globalSearch(query: SearchFileDto, _user: RequestUser): Promise<GlobalSearchResponseDto> {
        const descendantIds = await this.nodeService.getDescendantIds(query.currentNodeId);
        const elasticResult = await this.searchService.search(query.searchQuery, descendantIds);
        const hits = elasticResult.hits.hits ?? [];
        const total =
            typeof elasticResult.hits.total === 'number'
                ? elasticResult.hits.total
                : (elasticResult.hits.total?.value ?? hits.length);

        const items = hits.map((hit) =>
            mapElasticHitToSearchItem(hit as Parameters<typeof mapElasticHitToSearchItem>[0]),
        );
        const enrichedItems = await this.enrichSearchItems(items);

        return {
            items: enrichedItems,
            total,
            page: DEFAULT_PAGE,
            limit: DEFAULT_LIMIT,
        };
    }

    private async enrichSearchItems(items: SearchResultItemDto[]): Promise<SearchResultItemDto[]> {
        if (items.length === 0) {
            return items;
        }

        const fileItems = items.filter((item): item is FileSearchItemDto => item.kind === 'file');
        const directoryItems = items.filter((item): item is DirectorySearchItemDto => item.kind === 'directory');

        const documentVersionIds = fileItems.map((item) => item.id);
        const nodeIds = [
            ...new Set([
                ...fileItems.map((item) => item.nodeId).filter(Boolean),
                ...directoryItems.map((item) => item.id),
            ]),
        ];

        const [documentVersions, nodes] = await Promise.all([
            documentVersionIds.length
                ? this.prisma.documentVersion.findMany({
                      where: { id: { in: documentVersionIds } },
                      include: { mediaFile: true },
                  })
                : [],
            nodeIds.length
                ? this.prisma.node.findMany({
                      where: { id: { in: nodeIds } },
                      select: { id: true, parentId: true },
                  })
                : [],
        ]);

        const documentVersionMap = new Map(
            documentVersions.map((documentVersion) => [documentVersion.id, documentVersion] as const),
        );
        const nodeMap = new Map(nodes.map((node) => [node.id, node] as const));
        const pathCache = new Map<string, PathPart[]>();

        const getPathCached = async (nodeId: string): Promise<PathPart[]> => {
            if (!pathCache.has(nodeId)) {
                pathCache.set(nodeId, await this.nodeService.getPath(nodeId));
            }

            return pathCache.get(nodeId)!;
        };

        return Promise.all(
            items.map(async (item) => {
                if (item.kind === 'directory') {
                    const node = nodeMap.get(item.id);

                    return {
                        ...item,
                        parentId: node?.parentId ?? item.parentId,
                        path: await getPathCached(item.id),
                    };
                }

                const fileItem = item;
                const documentVersion = documentVersionMap.get(fileItem.id);
                const node = nodeMap.get(fileItem.nodeId);

                return {
                    ...fileItem,
                    parentId: node?.parentId ?? null,
                    fileUrl: documentVersion?.mediaFile?.filePath ?? fileItem.fileUrl,
                    path: fileItem.nodeId ? await getPathCached(fileItem.nodeId) : [],
                };
            }),
        );
    }
}
