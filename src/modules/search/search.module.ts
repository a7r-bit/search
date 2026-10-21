import { Module } from '@nestjs/common';
import { SearchService } from './search.service';
import { SearchController } from './search.controller';
import { HttpInfrastructureModule } from '../../infrastructure/http/http.module';

@Module({
    imports: [HttpInfrastructureModule],
    controllers: [SearchController],
    providers: [SearchService],
})
export class SearchModule {}
