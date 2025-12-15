import { ExecutionContext, NotAcceptableException, createParamDecorator, } from '@nestjs/common';
import { Request } from 'express';
/*
*      @SortingParams([...Object.values(DocumentVersionSortParamsEnum)]) sort?: SortingParam
*      Кастомный декоратор для извлечения параметра сортировки из запроса и проверки его на валидность
*/

export type SortingParam = {
    property: string;
    direction: string;
};

export const SortingParams = createParamDecorator(
    (validParams, ctx: ExecutionContext): SortingParam | null => {
        const req: Request = ctx.switchToHttp().getRequest();
        const sort = req.query.sort as string;

        if (!sort) return null;

        if (typeof validParams != 'object')
            throw new NotAcceptableException('Неверные настройки сортировки');

        const sortPattern = /^([a-zA-Z0-9]+):(asc|desc)$/;
        if (!sort.match(sortPattern))
            throw new NotAcceptableException(
                'Невалидный параметр сортировки, разрешенный (asc|desc)',
            );

        const [property, direction] = sort.split(':');
        if (!validParams.includes(property))
            throw new NotAcceptableException(
                `Невалидный параметр сортировки: ${property}, разрешенне: [${validParams}]`,
            );

        return { property, direction };
    },
);