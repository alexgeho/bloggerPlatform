import { Request, Response } from 'express';
import { HttpStatus } from '../../../../core/types/http-statuses';
import { mapToPostOutput } from '../mappers/map-to-post-output.util';
import { postsService } from '../../application/posts.service';
import { errorsHandler } from '../../../../core/errors/errors.handler';
import {likesService} from "../../../likes/likes.serviceAndRep";

export async function getPostHandler( req: Request<{ id: string }>, res: Response)
{
    try {
        const postId = req.params.id;
        const userId = req.user?.userId;

        const post
            = await postsService.findByIdOrFail(postId);

        const likesExtended
            = await likesService.findAllLikesOnPost(postId, userId)

        const postOutput = mapToPostOutput(post, likesExtended);

        res.status(HttpStatus.Ok).send(postOutput);
    } catch (e: unknown) {
        errorsHandler(e, res);
    }
}
