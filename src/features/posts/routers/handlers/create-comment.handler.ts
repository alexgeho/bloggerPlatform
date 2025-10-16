import { Request, Response } from 'express';
import { HttpStatus } from '../../../../core/types/http-statuses';
import { errorsHandler } from '../../../../core/errors/errors.handler';
import {CommentDataOutput} from "../../../comments/routers/output/comment-data.output";
import {commentsService} from "../../../comments/application/comments.service";
import {postsQwRepository} from "../../repositories/postsQwrepository";

export async function createCommentHandler (req: Request, res: Response) {

    try {
        const postId = req.params.id;
        const dto = req.body;
        const user = req.user;

        const createdCommentData: CommentDataOutput = await commentsService.create(postId, dto, user);

        res.status(HttpStatus.Created).send(createdCommentData);
    } catch (e) {
        errorsHandler(e, res);
    }
}

