import { Inject, Injectable } from '@nestjs/common';
import Logger, { LOGGER_KEY } from './shared/infrastructure/logger/domain/logger';

@Injectable()
export class AppService {
    constructor(@Inject(LOGGER_KEY) private logger: Logger) {}
    async getHello() {
        // this.logger.fatal(
        //     "TestUserMessage",
        //     {props:{foo:"bar", baz:"qux"}},
        // );
        return { hello: 'Hello World 12' };
    }
}
