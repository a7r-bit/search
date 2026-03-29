import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const PERMISSION_KEY = 'permission';

export const Permission = createParamDecorator((data: unknown, context: ExecutionContext) => {
    return Reflect.getMetadata(PERMISSION_KEY, context.getHandler());
});
