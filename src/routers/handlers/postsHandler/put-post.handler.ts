import { Request, Response } from 'express';
import { PostInputDto } from '../../../posts/dto/post.input-dto';
import { HttpStatus } from '../../../core/types/http-statuses';
import { postsRepository } from '../../../posts/repositories/posts.repository';
import { createErrorMessages } from '../../../core/middlewares/validation/input-validtion-result.middleware';
import {blogsRepository} from "../../../blogs/repositories/blogs.repository";

export async function putPostHandler(
    req: Request<{ id: string }, {}, PostInputDto>,
    res: Response,
) {
    try {
        const { blogId } = req.body;
        const blog = await blogsRepository.findById(blogId);

        if (!blog) {
            res
                .status(HttpStatus.NotFound)
                .send(createErrorMessages([{ field: 'blogId', message: 'Blog not found' }]));
            return;
        }

        const id = req.params.id;
        const post = await postsRepository.findById(id); // ✅ await добавлен

        if (!post) {
            res
                .status(HttpStatus.NotFound)
                .send(createErrorMessages([{ field: 'id', message: 'Post not found' }]));
            return;
        }

        await postsRepository.update(id, req.body);
        res.sendStatus(HttpStatus.NoContent);
    } catch (e: unknown) {
        res.sendStatus(HttpStatus.InternalServerError);
    }
}
