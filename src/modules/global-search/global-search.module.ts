import { Module } from '@nestjs/common';
import { GlobalSearchService } from './global-search.service';
import { GlobalSearchController } from './global-search.controller';
import { SearchModule } from '../search';

@Module({
    imports: [SearchModule],
    controllers: [GlobalSearchController],
    providers: [GlobalSearchService],
})
export class GlobalSearchModule {}
