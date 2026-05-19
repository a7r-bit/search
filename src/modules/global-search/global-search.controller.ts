import { Body, Controller, Post } from '@nestjs/common';
import { GlobalSearchService } from './global-search.service';
import { SearchFileDto } from '../document-version';
import { SearchResultDTO } from './dto/search-result.dto';
import { ApiBearerAuth, ApiBody, ApiOkResponse, ApiOperation } from '@nestjs/swagger';

@Controller('global-search')
export class GlobalSearchController {
    constructor(private readonly globalSearchService: GlobalSearchService) {}

    @Post()
    @ApiBearerAuth('access-token')
    @ApiOperation({ summary: 'Поиск по всем документам' })
    @ApiBody({ type: SearchFileDto })
    async globalSearch(@Body() query: SearchFileDto): Promise<SearchResultDTO[]> {
        return this.globalSearchService.globalSearch(query);
    }
}
