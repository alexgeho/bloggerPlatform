import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/types/http-statuses';
import { blogsService } from '../../application/blogs.service';
import { BlogUpdateInput } from '../input/blog-update.input';
import { errorsHandler } from '../../../core/errors/errors.handler';

export async function putBlogHandler(
    req: Request<{ id: string }, {}, BlogUpdateInput>,
    res: Response,
) {
    try {
        const id = req.params.id;

        await blogsService.update(id, req.body);

        res.sendStatus(HttpStatus.NoContent);
    } catch (e: unknown) {
        errorsHandler(e, res);
    }
}
