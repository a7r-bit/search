import { Body, Controller, Post, Req } from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiBody,
    ApiExtraModels,
    ApiOkResponse,
    ApiOperation,
    ApiTags,
    getSchemaPath,
} from '@nestjs/swagger';
import { GlobalSearchService } from './global-search.service';
import { SearchFileDto } from './dto/search-file.dto';
import {
    DocumentVersionSearchResultDto,
    NodeSearchResultDto,
    SearchResultDTO,
} from './dto/search-result.dto';
import { RequestUser } from '../../common/types/request-user';

@ApiTags('global-search')
@ApiBearerAuth('access-token')
@Controller('global-search')
export class GlobalSearchController {
    constructor(private readonly globalSearchService: GlobalSearchService) {}

    @Post()
    @ApiOperation({
        summary: 'Глобальный поиск по узлам и документам',
        description:
            'Ищет по Elasticsearch в пределах текущего узла и его потомков (до 2 уровней вложенности).',
    })
    @ApiBody({ type: SearchFileDto })
    @ApiExtraModels(NodeSearchResultDto, DocumentVersionSearchResultDto)
    @ApiOkResponse({
        description: 'Список найденных узлов и версий документов',
        schema: {
            type: 'array',
            items: {
                oneOf: [
                    { $ref: getSchemaPath(NodeSearchResultDto) },
                    { $ref: getSchemaPath(DocumentVersionSearchResultDto) },
                ],
            },
        },
    })
    async globalSearch(@Body() query: SearchFileDto, @Req() req): Promise<SearchResultDTO[]> {
        return this.globalSearchService.globalSearch(query, req.user as RequestUser);
    }
}
