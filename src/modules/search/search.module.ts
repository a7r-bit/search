import { Module } from '@nestjs/common';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { SearchService } from './search.service';

@Module({
    imports: [
        ElasticsearchModule.registerAsync({
            useFactory: async () => {
                const host = 'elasticsearch';
                const port = process.env.ELASTICSEARCH_PORT || '9200';
                const username = process.env.ELASTIC_USERNAME || 'elastic';
                const password = process.env.ELASTIC_PASSWORD;

                if (!password) {
                    throw new Error(
                        'ELASTIC_PASSWORD не задан. Установите переменную окружения для подключения к Elasticsearch 8.x с включенной security.',
                    );
                }

                const node = `http://${host}:${port}`;

                return {
                    node,
                    auth: { username, password },
                    maxRetries: Number(process.env.ES_MAX_RETRIES ?? 3),
                    requestTimeout: Number(process.env.ES_REQUEST_TIMEOUT_MS ?? 30000),
                    pingTimeout: Number(process.env.ES_PING_TIMEOUT_MS ?? 2000),
                };
            },
        }),
    ],
    providers: [SearchService],
    exports: [SearchService],
})
export class SearchModule {}
