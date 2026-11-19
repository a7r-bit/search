import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { Request } from 'express';
/*
 *      @User() user: RequestUser
 *      Параметрический декоратор для извлечения request.user,
 *      установленного AccessGuard (RequestUser) или LdapAuthGuard (LdapUserPayload)
 */

export const User = createParamDecorator((_data: unknown, ctx: ExecutionContext) => {
    const req: Request = ctx.switchToHttp().getRequest();
    return req.user;
});
