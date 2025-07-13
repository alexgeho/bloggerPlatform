import { paginationAndSortingDefault } from '../middlewares/validation/query-pagination-sorting.validation-middleware';
import { PaginationAndSorting } from '../types/pagination-and-sorting';

export function setDefaultSortAndPaginationIfNotExist<P = string>(
    query: Partial<PaginationAndSorting<P>>,
): PaginationAndSorting<P> {
    return {
        ...paginationAndSortingDefault,
        ...query,
        pageNumber: Number(query.pageNumber ?? paginationAndSortingDefault.pageNumber),
        pageSize: Number(query.pageSize ?? paginationAndSortingDefault.pageSize),
        sortBy: (query.sortBy ?? paginationAndSortingDefault.sortBy) as P,
    };
}
