import { Global, Inject, MiddlewareConsumer, Module, NestModule, Scope } from '@nestjs/common';
import Logger, { LoggerBaseKey, LOGGER_KEY } from '../../../domain/logger';
import WinstonLogger, { WinstonLoggerTransportsKey } from '../winston.logger';
import LoggerService from '../../../domain/loggerService';
import NestjsLoggerServiceAdapter from './nestjsLoggerServiceAdapter';
import { ConfigService } from '@nestjs/config';
import ConsoleTransport from '../transport/consoleTransport';
import morgan from 'morgan';

@Global()
@Module({
    imports: [],
    controllers: [],
    providers: [
        {
            provide: LoggerBaseKey,
            useClass: WinstonLogger,
        },
        {
            provide: LOGGER_KEY,
            useClass: LoggerService,
            scope: Scope.TRANSIENT,
        },
        {
            provide: NestjsLoggerServiceAdapter,
            useFactory: (logger: Logger) => new NestjsLoggerServiceAdapter(logger),
            inject: [LOGGER_KEY],
        },
        {
            provide: WinstonLoggerTransportsKey,
            useFactory: (configService: ConfigService) => {
                const transports = [];
                // console transport
                transports.push(ConsoleTransport.createColorize());
                // file transport
                // transports.push(FileTransport.create());
                return transports;
            },
            inject: [ConfigService],
        },
    ],
    exports: [LOGGER_KEY, NestjsLoggerServiceAdapter],
})
export class LoggerModule implements NestModule {
    public constructor(
        @Inject(LOGGER_KEY) private logger: Logger,
        private configService: ConfigService,
    ) {}

    public configure(consumer: MiddlewareConsumer): void {
        consumer
            .apply(
                morgan(this.configService.get<string>('NODE_ENV') === 'production' ? 'combined' : 'dev', {
                    stream: {
                        write: (message: string) => {
                            this.logger.debug(message, {
                                sourceClass: 'RequestLogger',
                            });
                        },
                    },
                }),
            )
            .forRoutes('*');
    }
}
