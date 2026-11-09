import { Module } from '@nestjs/common';
import { SearchService } from './application/search.service';
import { SearchController } from './presentation/search.controller';
import { HttpInfrastructureModule } from '../../shared/infrastructure/http/http.module';

@Module({
    imports: [HttpInfrastructureModule],
    controllers: [SearchController],
    providers: [SearchService],
})
export class SearchModule {}
