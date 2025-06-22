import {Request, Response} from 'express';
import {HttpStatus} from '../../../core/types/http-statuses';
import {createErrorMessages} from '../../../core/utils/error.utils';
import {postsRepository} from "../../../posts/repositories/posts.repository";

export function deletePostHandler(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const post = postsRepository.findById(id);

    if (!post) {
        res
            .status(HttpStatus.NotFound)
            .send(createErrorMessages([{ field: 'id', message: 'post not found' }]));
        return;
    }

    postsRepository.delete(id);
    res.sendStatus(HttpStatus.NoContent);
}
