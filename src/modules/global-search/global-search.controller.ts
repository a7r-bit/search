import { Body, Controller, Post, Req } from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiBody,
    ApiExtraModels,
    ApiOkResponse,
    ApiOperation,
    ApiTags,
} from '@nestjs/swagger';
import { GlobalSearchService } from './global-search.service';
import { SearchFileDto } from './dto/search-file.dto';
import { DirectorySearchItemDto, FileSearchItemDto, GlobalSearchResponseDto } from './dto';
import { RequestUser } from '../../common/types/request-user';

@ApiTags('global-search')
@ApiBearerAuth('access-token')
@Controller('global-search')
export class GlobalSearchController {
    constructor(private readonly globalSearchService: GlobalSearchService) {}

    @Post()
    @ApiOperation({
        summary: 'Глобальный поиск по узлам и документам',
        description: 'Ищет по Elasticsearch в пределах текущего узла и всех его потомков.',
    })
    @ApiBody({ type: SearchFileDto })
    @ApiExtraModels(DirectorySearchItemDto, FileSearchItemDto, GlobalSearchResponseDto)
    @ApiOkResponse({ type: GlobalSearchResponseDto })
    async globalSearch(@Body() query: SearchFileDto, @Req() req): Promise<GlobalSearchResponseDto> {
        return this.globalSearchService.globalSearch(query, req.user as RequestUser);
    }
}
