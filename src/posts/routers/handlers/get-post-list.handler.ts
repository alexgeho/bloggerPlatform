import { Request, Response } from 'express';
import { postsService } from '../../application/posts.service';
import { errorsHandler } from '../../../core/errors/errors.handler';
import { mapToPostListPaginatedOutput } from '../mappers/map-to-post-list-paginated-output.util';
import { PostQueryInput } from '../input/post-query.input';
import { setDefaultSortAndPaginationIfNotExist } from '../../../core/helpers/set-default-sort-and-pagination';
import {PaginationAndSorting} from "../../../core/types/pagination-and-sorting";
import {PostSortField} from "../input/post-sort-field";

export async function getPostListHandler(req: Request, res: Response) {
    try {
        const queryInput = setDefaultSortAndPaginationIfNotExist(
            req.query as Partial<PaginationAndSorting<PostSortField>> & { searchNameTerm?: string }
        ) as PostQueryInput;

        const { items, totalCount } = await postsService.findMany(queryInput);

        const postsListOutput = mapToPostListPaginatedOutput(items, {
            pageNumber: queryInput.pageNumber,
            pageSize: queryInput.pageSize,
            totalCount,
        });

        res.send(postsListOutput);
    } catch (e: unknown) {
        errorsHandler(e, res);
    }
}
