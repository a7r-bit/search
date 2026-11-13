import { Controller, Get, Query } from '@nestjs/common';
import { SearchService } from '../application/search.service';
import { SearchQuery } from './dto/search-query.dto';
import { SearchResult } from './dto/search-hit.dto';

@Controller('search')
export class SearchController {
    constructor(private readonly searchService: SearchService) {}

    @Get()
    search(@Query() query: SearchQuery): Promise<SearchResult> {
        return this.searchService.search(query);
    }
}
