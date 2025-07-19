import { Request, Response } from 'express';
import { userService } from '../../application/user.service';
import { errorsHandler } from '../../../core/errors/errors.handler';
import { mapToBlogListPaginatedOutput } from '../mappers/map-to-blog-list-paginated-output.util';
import { BlogQueryInput } from '../input/user-query.input';
import { setDefaultSortAndPaginationIfNotExist } from '../../../core/helpers/set-default-sort-and-pagination';
import {PaginationAndSorting} from "../../../core/types/pagination-and-sorting";
import {UserSortField} from "../input/user-sort-field";

export async function getBlogListHandler(req: Request, res: Response) {
    try {
        const queryInput = setDefaultSortAndPaginationIfNotExist(
            req.query as Partial<PaginationAndSorting<UserSortField>> & { searchNameTerm?: string }
        ) as BlogQueryInput;

        const { items, totalCount } = await userService.findMany(queryInput);

        const blogsListOutput = mapToBlogListPaginatedOutput(items, {
            pageNumber: queryInput.pageNumber,
            pageSize: queryInput.pageSize,
            totalCount,
        });

        res.send(blogsListOutput);
    } catch (e: unknown) {
        errorsHandler(e, res);
    }
}
