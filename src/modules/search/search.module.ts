import { Module } from '@nestjs/common';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { SearchService } from './search.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
    imports: [
        ConfigModule,
        ElasticsearchModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (config: ConfigService) => {
                const host = config.get<string>('ELASTICSEARCH_HOST');
                const port = config.get<string>('ELASTICSEARCH_PORT');
                const username = config.get<string>('ELASTIC_USERNAME');
                const password = config.get<string>('ELASTIC_PASSWORD');

                const maxRetries = Number(config.get<string>('ES_MAX_RETRIES', '3'));
                const requestTimeout = Number(config.get<string>('ES_REQUEST_TIMEOUT_MS', '30000'));
                const pingTimeout = Number(config.get<string>('ES_PING_TIMEOUT_MS', '2000'));

                if (!host || !port) {
                    throw new Error('ELASTICSEARCH_HOST and ELASTICSEARCH_PORT must be configured');
                }
                if (!username || !password) {
                    throw new Error('ELASTIC_USERNAME and ELASTIC_PASSWORD must be configured');
                }


                const node = `http://${host}:${port}`;

                return {
                    node,
                    auth: { username, password },
                    maxRetries: maxRetries,
                    requestTimeout: requestTimeout,
                    pingTimeout: pingTimeout,
                };
            },
        }),
    ],
    providers: [SearchService],
    exports: [SearchService],
})
export class SearchModule { }
