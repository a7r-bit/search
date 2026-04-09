// src/common/pagination/pagination.service.ts
import { Injectable } from '@nestjs/common';
import { PaginatedResult, PaginationParams, PaginationMetaDto } from './pagination.types';

@Injectable()
export class PaginationService {
    private readonly DEFAULT_PER_PAGE = 10;
    private readonly MAX_PER_PAGE = 100;

    createPaginator(defaultOptions: PaginationParams = {}) {
        const defaultPerPage = Math.min(defaultOptions.perPage || this.DEFAULT_PER_PAGE, defaultOptions.maxPerPage || this.MAX_PER_PAGE);

        return async <T, K>(model: any, args?: K, options?: PaginationParams): Promise<PaginatedResult<T>> => {
            const page = Math.max(1, Number(options?.page || defaultOptions.page) || 1);
            let perPage = Number(options?.perPage || defaultPerPage);

            // Защита от слишком больших страниц
            perPage = Math.min(perPage, options?.maxPerPage || this.MAX_PER_PAGE);

            const skip = (page - 1) * perPage;

            const [total, data] = await Promise.all([
                model.count({ where: (args as any)?.where }),
                model.findMany({
                    ...(args as any),
                    take: perPage,
                    skip,
                }),
            ]);

            const lastPage = Math.ceil(total / perPage);

            return {
                data,
                meta: {
                    total,
                    lastPage,
                    currentPage: page,
                    perPage,
                    prev: page > 1 ? page - 1 : null,
                    next: page < lastPage ? page + 1 : null,
                },
            };
        };
    }

    // Метод для создания Swagger документации для конкретного контроллера
    getPaginatedResponseSchema(modelName: string) {
        return {
            schema: {
                example: {
                    data: [`${modelName}Object`],
                    meta: {
                        total: 100,
                        lastPage: 10,
                        currentPage: 1,
                        perPage: 10,
                        prev: null,
                        next: 2,
                    },
                },
            },
        };
    }
}
