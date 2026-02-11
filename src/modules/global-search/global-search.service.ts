import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma';
import { normalizeElasticHit, SearchResultDTO } from './dto/search-result.dto';
import { SearchService } from '../search';
import { SearchFileDto } from '../document-version';

@Injectable()
export class GlobalSearchService {

    constructor(private readonly prisma: PrismaService, private readonly searchService: SearchService) { }
    async globalSearch(query: SearchFileDto): Promise<SearchResultDTO[]> {

        const l1Ids = await this.prisma.node.findMany({
            where: {
                parentId: query.currentNodeId
            },
            select: ({ id: true })
        }).then(ids => ids.map(id => id.id));

        const l2Ids = await this.prisma.node.findMany({
            where: { parentId: { in: l1Ids } },
            select: ({ id: true })
        }).then(ids => ids.map(id => id.id));




        const allNodesId = [...l1Ids, ...l2Ids, query.currentNodeId];
        console.log(allNodesId);



        const elasticResult = await this.searchService.search(query.searchQuery, allNodesId);

        const results = elasticResult.hits.hits.map((hit: any) =>
            normalizeElasticHit(hit));
        // hit);

        return results;
    }


}
