import {Request, Response} from 'express';
import {HttpStatus} from '../../../core/types/http-statuses';
import {createErrorMessages} from '../../../core/utils/error.utils';
import {postsRepository} from "../../../posts/repositories/posts.repository";
import {mapToPostViewModel} from "../../../posts/mappers/map-to-post-view-model.util";

export async function getPostHandler(req: Request, res: Response) {

try {
    const id = req.params.id;
    const post = await postsRepository.findById(id);


    if (!post) {
        res
            .status(HttpStatus.NotFound)
            .send(
                createErrorMessages([{ field: 'id', message: 'Post not found' }]),
            );

        return;
    }

    const driverViewModel = mapToPostViewModel(post);
    res.status(HttpStatus.Ok).send(driverViewModel);
} catch (e: unknown) {
    res.sendStatus(HttpStatus.InternalServerError);
}
}