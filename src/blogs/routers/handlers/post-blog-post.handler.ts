import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/types/http-statuses';
import { errorsHandler } from '../../../core/errors/errors.handler';
import { postsService } from '../../../posts/application/posts.service';
import {blogsService} from "../../application/blogs.service";

export async function postBlogPostHandler(
    req: Request,
    res: Response
): Promise<void> {
    try {
        const blogId = req.params.blogId;

        // Проверяем существование блога
        const blog = await blogsService.findByIdOrFail(blogId);
        if (!blog) {
            res.status(HttpStatus.NotFound).send({ message: 'Blog not found' });
            return;
        }

        // Объединяем blogId из params и всё из body
        const createdPostData = await postsService.create({
            ...req.body,
            blogId,
        });

        res.status(HttpStatus.Created).send(createdPostData);
    } catch (e) {
        errorsHandler(e, res);
    }
}

