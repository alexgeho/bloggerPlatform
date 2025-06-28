import { Request, Response } from 'express';
import { PostInputDto } from '../../../posts/dto/post.input-dto';
import { HttpStatus } from '../../../core/types/http-statuses';
import { postsRepository } from '../../../posts/repositories/posts.repository';
import { createErrorMessages } from '../../../core/middlewares/validation/input-validtion-result.middleware';

export async function putPostHandler(
    req: Request<{ id: string }, {}, PostInputDto>,
    res: Response,
) {
    try {
        const id = req.params.id;
        const post = postsRepository.findById(id);

        if (!post) {
            res
                .status(HttpStatus.NotFound)
                .send(
                    createErrorMessages([{ field: 'id', message: 'Post not found' }]),
                );
            return;
        }

        await postsRepository.update(id, req.body);
        res.sendStatus(HttpStatus.NoContent);
    } catch (e: unknown) {
        res.sendStatus(HttpStatus.InternalServerError);
    }
}
