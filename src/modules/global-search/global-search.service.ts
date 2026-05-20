import { Injectable } from '@nestjs/common';
import { normalizeElasticHit, SearchResultDTO } from './dto/search-result.dto';
import { SearchService } from '../search';
import { SearchFileDto } from './dto/search-file.dto';
import { RequestUser } from '../../common/types/request-user';
import { NodeService } from '../node';

@Injectable()
export class GlobalSearchService {
    constructor(
        private readonly searchService: SearchService,
        private readonly nodeService: NodeService,
    ) {}
    async globalSearch(query: SearchFileDto, user:RequestUser): Promise<SearchResultDTO[]> {
        const currentNodeId =  query.currentNodeId ?? null;
        const descendantIds = await this.nodeService.getDescendantIds(currentNodeId);
        const elasticResult = await this.searchService.search(query.searchQuery,descendantIds);
        const results = elasticResult.hits.hits.map((hit: any) => normalizeElasticHit(hit));

        return results;
    }
}
