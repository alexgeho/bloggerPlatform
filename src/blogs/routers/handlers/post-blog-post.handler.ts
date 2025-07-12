import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/types/http-statuses';
import { errorsHandler } from '../../../core/errors/errors.handler';
import { postsService } from '../../../posts/application/posts.service';

export async function postBlogPostHandler(req: Request, res: Response) {
    try {
        // Объединяем blogId из params и всё из body
        const createdPostData = await postsService.create({
            ...req.body,
            blogId: req.params.blogId,
        });

        res.status(HttpStatus.Created).send(createdPostData);
    } catch (e) {
        errorsHandler(e, res);
    }
}
