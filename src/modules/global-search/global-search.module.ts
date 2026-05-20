import { Module } from '@nestjs/common';
import { GlobalSearchService } from './global-search.service';
import { GlobalSearchController } from './global-search.controller';
import { SearchModule } from '../search';
import { NodeModule } from '../node';

@Module({
    imports: [SearchModule, NodeModule],
    controllers: [GlobalSearchController],
    providers: [GlobalSearchService],
})
export class GlobalSearchModule {}
