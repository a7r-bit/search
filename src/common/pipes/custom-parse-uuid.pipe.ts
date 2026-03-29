import { BadRequestException, NotFoundException, ParseUUIDPipe } from '@nestjs/common';

export class CustomParseUUIDPipe extends ParseUUIDPipe {
    constructor() {
        super({
            exceptionFactory(errors) {
                throw new BadRequestException({
                    message: 'ID не валиден.',
                    errors,
                });
            },
        });
    }
}
