import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const USER_ID_KEY = 'user_id';

export const UserId = createParamDecorator((data: unknown, context: ExecutionContext) => {
    return Reflect.getMetadata(USER_ID_KEY, context.getHandler());
});
