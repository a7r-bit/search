import { applyDecorators } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';

export const ApiSortingQuery = (params: string[]) => {
    return applyDecorators(
        ApiQuery({
            // the name of the query property to pass to the query object of the request.
            name: 'sort',

            // make optional
            required: false,

            // ensures that the sort parameter is serialized as a single string
            explode: false,

            type: String,

            description: `Параметр для сортировки в формате: ?sort=property:(asc|desc), разрешенные поля сортировки: ${JSON.stringify(params)}`,
        }),
    );
};
