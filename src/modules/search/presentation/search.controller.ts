import { Controller, Get, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiServiceUnavailableResponse } from '@nestjs/swagger';
import { SearchService } from '../application/search.service';
import { SearchQuery } from './dto/search-query.dto';
import { SearchResult } from './dto/search-hit.dto';

@Controller('search')
@ApiBearerAuth('access-token')
export class SearchController {
    constructor(private readonly searchService: SearchService) {}

    @Get()
    @ApiOperation({
        summary: 'Глобальный поиск',
        description:
            'Ищет элементы (документы и папки) через поисковый микросервис. Возвращает список externalId найденных элементов с пагинацией.',
    })
    @ApiOkResponse({ description: 'Результаты поиска', type: SearchResult })
    @ApiServiceUnavailableResponse({ description: 'Поисковый индекс недоступен' })
    search(@Query() query: SearchQuery): Promise<SearchResult> {
        return this.searchService.search(query);
    }
}
