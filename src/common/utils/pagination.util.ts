import { Pagination } from '../interfaces/pagination.interface';

export function createPagination<T>(
    items: T[],
    total: number,
    page: number,
    limit: number,
): Pagination<T> {
    const totalPages = Math.ceil(total / limit);

    return {
        items,
        meta: {
            total: Number(total),
            page: Number(page),
            limit: Number(limit),
            totalPages: Number(totalPages),
        },
    };
}
