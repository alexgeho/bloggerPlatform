import { Request, Response } from 'express';
import { commentsService } from '../../application/comments.service';
import { errorsHandler } from '../../../../core/errors/errors.handler';
import { setDefaultSortAndPaginationIfNotExist } from '../../../../core/helpers/set-default-sort-and-pagination';
import { PaginationAndSorting } from '../../../../core/types/pagination-and-sorting';
import { CommentSortField } from '../input/comment-sort-field';
import { CommentQueryInput } from '../input/comment-query.input';
import {postsQwRepository} from "../../../posts/repositories/postsQwrepository";

export async function getCommentsByPostHandler(req: Request, res: Response) {
    try {
        const postId = req.params.id;

        console.log('req.params.id:', postId)

        const queryInput = setDefaultSortAndPaginationIfNotExist(
            req.query as Partial<PaginationAndSorting<CommentSortField>>
        ) as CommentQueryInput;

        const checkIfPostExist = await postsQwRepository.findById(postId)
        console.log('checkIfPostExist:', checkIfPostExist)


        if (!checkIfPostExist) {
            res.sendStatus(404);
            return;
        }

        const result
            = await commentsService.findManyCommentsByPostId(postId, queryInput);

        console.log('result:', result)


        res.send(result);
    } catch (e: unknown) {
        console.error(e);
        errorsHandler(e, res);
    }
}
