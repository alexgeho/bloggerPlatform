import { Request, Response } from 'express';
import { commentsService } from '../../application/comments.service';
import { errorsHandler } from '../../../../core/errors/errors.handler';
import { setDefaultSortAndPaginationIfNotExist } from '../../../../core/helpers/set-default-sort-and-pagination';
import { PaginationAndSorting } from '../../../../core/types/pagination-and-sorting';
import { CommentSortField } from '../input/comment-sort-field';
import { CommentQueryInput } from '../input/comment-query.input';

export async function getCommentsHandler(req: Request, res: Response) {
    try {
        const userId = req.user?.userId || null;

        const queryInput = setDefaultSortAndPaginationIfNotExist(
            req.query as Partial<PaginationAndSorting<CommentSortField>>
        ) as CommentQueryInput;

        const result = await commentsService.findMany(queryInput, userId);

        res.status(200).send(result);
    } catch (e: unknown) {
        console.error(e);
        errorsHandler(e, res);
    }
}
