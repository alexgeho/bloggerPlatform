// src/features/comments/routers/handlers/get-comments-by-post.handler.ts

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

        const queryInput = setDefaultSortAndPaginationIfNotExist(
            req.query as Partial<PaginationAndSorting<CommentSortField>>
        ) as CommentQueryInput;

        const checkIfPostExist = await postsQwRepository.findById(postId)

        if (!checkIfPostExist) {
            res.sendStatus(404);
            return;
        }

        const result
            = await commentsService.findManyByPostId(postId, queryInput);

        res.send(result);
    } catch (e: unknown) {
        console.error(e);
        errorsHandler(e, res);
    }
}
