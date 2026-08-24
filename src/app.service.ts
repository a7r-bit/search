import { Inject, Injectable } from '@nestjs/common';
import Logger, { LoggerKey } from './infrastructure/logger/domain/logger';

@Injectable()
export class AppService {
    constructor(@Inject(LoggerKey)private logger: Logger){}
    async getHello() {
        // this.logger.fatal(
        //     "TestUserMessage",
        //     {props:{foo:"bar", baz:"qux"}}, 
        // );
        return { hello: 'Hello World 12' };
    }
}
