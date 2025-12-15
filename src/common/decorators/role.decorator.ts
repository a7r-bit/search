import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const ROLE_KEY = "role";

export const Role = createParamDecorator((data: unknown, context: ExecutionContext) => {
    return Reflect.getMetadata(ROLE_KEY, context.getHandler())
})