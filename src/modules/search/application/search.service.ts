import { Injectable } from '@nestjs/common';
import { SearchReader } from '../domain/search-reader.interface';
import { IndexWriter } from '../domain/index-writer.interface';
import { SearchIndexPayload, SearchDeletePayload } from '../domain/search-payload.interface';
import { SearchHitDto, SearchRawHit, SearchResult, SearchResultDto } from '../presentation/dto/search-hit.dto';
import { SearchQuery } from '../presentation/dto/search-query.dto';
import { Kind } from '../presentation/dto/search.types';
import { SearchApiClient } from '../../../shared/infrastructure/http/clients/search-api.client';
import { PrismaService } from '../../../shared/infrastructure/prisma/prisma.service';
import { NodeTreeRepository } from '../../node/domain/node-tree.repository';

@Injectable()
export class SearchService implements IndexWriter, SearchReader {
    constructor(
        private readonly searchClient: SearchApiClient,
        private readonly prisma: PrismaService,
        private readonly nodeTreeRepository: NodeTreeRepository,
    ) {}

    async search(query: SearchQuery): Promise<SearchResult> {
        return this.searchClient.search(query);
    }

    /**
     * Поиск через микросервис + обогащение хитов данными из БД:
     * путь в дереве, версия документа, дата создания.
     * Документы индексируются по версиям (externalId = ID версии), папки — по ноде (externalId = ID ноды)
     */
    async searchDetailed(query: SearchQuery): Promise<SearchResultDto> {
        const raw = await this.searchClient.search(query);

        // Микросервис отдаёт богатые хиты (externalId/kind/score/title/highlight),
        // нормализуем под единый формат (совместимо и со строочным контрактом)
        const hits: SearchRawHit[] = (raw.items ?? []).map((item) => (typeof item === 'string' ? { externalId: item } : item));
        const ids = hits.map((hit) => hit.externalId);

        const versions = await this.prisma.documentVersion.findMany({
            where: { id: { in: ids } },
            include: { mediaFile: true },
        });
        const versionById = new Map(versions.map((version) => [version.id, version]));

        // У хитов документов ID ноды известен только через версию; у хитов папок externalId — это ID ноды
        const nodeIds = [...new Set(hits.map((hit) => versionById.get(hit.externalId)?.nodeId ?? hit.externalId))];
        const nodes = await this.prisma.node.findMany({ where: { id: { in: nodeIds } } });
        const nodeById = new Map(nodes.map((node) => [node.id, node]));

        const items = hits
            .map((hit): SearchHitDto | null => {
                // Хит документа — externalId это ID версии; хит папки — ID ноды
                const version = versionById.get(hit.externalId);
                const node = version ? nodeById.get(version.nodeId) : nodeById.get(hit.externalId);
                if (!node) {
                    return null;
                }
                return {
                    externalId: hit.externalId,
                    nodeId: node.id,
                    kind: hit.kind ?? (version ? Kind.DOCUMENT : Kind.FOLDER),
                    title: hit.title ?? version?.mediaFile?.fileName ?? node.name,
                    score: hit.score ?? 0,
                    highlight: hit.highlight ?? null,
                    path: [],
                    version: version?.version ?? null,
                    createdAt: (version?.createdAt ?? node.createdAt).toISOString(),
                };
            })
            .filter((item): item is SearchHitDto => item !== null);

        for (const item of items) {
            item.path = await this.nodeTreeRepository.getPath(item.nodeId);
        }

        return {
            items,
            total: raw.total,
            page: raw.page,
            limit: raw.limit,
        };
    }

    async index(entity: SearchIndexPayload): Promise<void> {
        return this.searchClient.index(entity);
    }

    async update(entity: SearchIndexPayload): Promise<void> {
        return this.searchClient.update(entity);
    }

    async delete(entity: SearchDeletePayload): Promise<void> {
        return this.searchClient.delete(entity);
    }
}
