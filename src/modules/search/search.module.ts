import { Module } from '@nestjs/common';
import { SearchService } from './search.service';
import { ElasticsearchModule } from '@nestjs/elasticsearch';

@Module({
  imports: [ElasticsearchModule.registerAsync({
    useFactory: async () => {
      return {
        node: `http://${process.env.ELASTICSEARCH_HOST || 'elasticsearch'}:${process.env.ELASTICSEARCH_PORT || 9200}`,
      }
    }
  })],
  providers: [SearchService],
  exports: [SearchService]
})
export class SearchModule { }
