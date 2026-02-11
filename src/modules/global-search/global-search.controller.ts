import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { GlobalSearchService } from './global-search.service';
import { SearchFileDto } from '../document-version';
import { SearchResultDTO } from './dto/search-result.dto';

@Controller('global-search')
export class GlobalSearchController {
  constructor(private readonly globalSearchService: GlobalSearchService) { }
  @Post()
  async globalSearch(
    @Body() query: SearchFileDto): Promise<SearchResultDTO[]> {
    return await this.globalSearchService.globalSearch(query);
  }



}
