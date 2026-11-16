import { Module } from '@nestjs/common';
import { SearchService } from './application/search.service';
import { SearchController } from './presentation/search.controller';
import { HttpInfrastructureModule } from '../../shared/infrastructure/http/http.module';
import { NodeInfrastructureModule } from '../node/node-infrastructure.module';
import { INDEX_WRITER } from './domain/index-writer.interface';

@Module({
    imports: [HttpInfrastructureModule, NodeInfrastructureModule],
    controllers: [SearchController],
    providers: [SearchService, { provide: INDEX_WRITER, useExisting: SearchService }],
    exports: [INDEX_WRITER],
})
export class SearchModule {}
