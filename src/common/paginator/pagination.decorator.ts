import { applyDecorators, Type } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import { PaginatedResult, PaginationMetaDto } from './pagination.types';

export const ApiPaginatedResponse = <TModel extends Type<any>>(
    model: TModel,
    options?: {
        description?: string;
        isArray?: boolean;
    },
) => {
    const description = options?.description || `Paginated list of ${model.name}`;

    return applyDecorators(
        ApiExtraModels(PaginatedResult, PaginationMetaDto, model),
        ApiOkResponse({
            description,
            schema: {
                title: `PaginatedResponseOf${model.name}`,
                allOf: [
                    {
                        properties: {
                            data: {
                                type: 'array',
                                items: { $ref: getSchemaPath(model) },
                                description: `Array of ${model.name} objects`,
                            },
                            meta: {
                                type: 'object',
                                $ref: getSchemaPath(PaginationMetaDto),
                                description: 'Pagination metadata',
                            },
                        },
                    },
                ],
            },
        }),
    );
};
