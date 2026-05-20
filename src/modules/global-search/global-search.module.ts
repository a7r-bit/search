import { Module } from '@nestjs/common';
import { GlobalSearchService } from './global-search.service';
import { GlobalSearchController } from './global-search.controller';
import { SearchModule } from '../search';
import { NodeModule } from '../node';
import { PrismaModule } from '../prisma';

@Module({
    imports: [SearchModule, NodeModule, PrismaModule],
    controllers: [GlobalSearchController],
    providers: [GlobalSearchService],
})
export class GlobalSearchModule {}
