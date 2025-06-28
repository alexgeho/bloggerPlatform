import { Request, Response } from 'express';
import { postsRepository } from '../../../posts/repositories/posts.repository';
import { mapToPostViewModel } from '../../../posts/mappers/map-to-post-view-model.util';
import { HttpStatus } from '../../../core/types/http-statuses';

export async function getPostListHandler(req: Request, res: Response) {
    try {
        const posts = await postsRepository.findAll();
        const postViewModels = posts.map(mapToPostViewModel);
        res.send(postViewModels);
    } catch (e: unknown) {
        res.sendStatus(HttpStatus.InternalServerError);
    }
}
