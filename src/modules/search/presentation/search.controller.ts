import { Controller, Get, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiServiceUnavailableResponse } from '@nestjs/swagger';
import { SearchService } from '../application/search.service';
import { SearchQuery } from './dto/search-query.dto';
import { SearchResultDto } from './dto/search-hit.dto';

@Controller('search')
@ApiBearerAuth('access-token')
export class SearchController {
    constructor(private readonly searchService: SearchService) {}

    @Get()
    @ApiOperation({
        summary: 'Глобальный поиск',
        description:
            'Ищет элементы (документы и папки) через поисковый микросервис. Возвращает найденные элементы с путём в дереве, актуальной версией документа и датой создания.',
    })
    @ApiOkResponse({ description: 'Результаты поиска', type: SearchResultDto })
    @ApiServiceUnavailableResponse({ description: 'Поисковый индекс недоступен' })
    search(@Query() query: SearchQuery): Promise<SearchResultDto> {
        return this.searchService.searchDetailed(query);
    }
}
