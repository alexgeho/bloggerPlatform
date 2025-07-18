import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/types/http-statuses';
import { errorsHandler } from '../../../core/errors/errors.handler';
import { postsService } from '../../application/posts.service';

export async function deletePostHandler(
    req: Request<{ id: string }>,
    res: Response,
) {
    try {
        const id = req.params.id;

        await postsService.delete(id);

        res.sendStatus(HttpStatus.NoContent);
    } catch (e: unknown) {
        errorsHandler(e, res);
    }
}
