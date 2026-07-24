import { Inject, Injectable } from '@nestjs/common';
import Logger, { LoggerKey } from './infrastructure/logger/domain/logger';

@Injectable()
export class AppService {
    constructor(@Inject(LoggerKey)private logger: Logger){}
    getHello() {
        this.logger.info(
            "TestMessage",
            {props:{foo:"bar", baz:"qux"}},
        );
        this.logger.debug(
            "TestMessage",
            {props:{foo:"bar", baz:"qux"}},
        );
        this.logger.warn(
            "TestMessage",
            {props:{foo:"bar", baz:"qux"}},
        );
        this.logger.emergency(
            "TestMessage",
            {props:{foo:"bar", baz:"qux"}},
        );
        this.logger.error(
            "TestMessage",
            {props:{foo:"bar", baz:"qux"}},
        );
        return { hello: 'Hello World 12' };
    }
}
