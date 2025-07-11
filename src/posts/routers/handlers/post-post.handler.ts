import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/types/http-statuses';
import { errorsHandler } from '../../../core/errors/errors.handler';
import {postsService} from '../../application/posts.service';

export async function postPostHandler(req: Request, res: Response) {
    try {
        // req.body напрямую!
        const createdPostData = await postsService.create(req.body);

        res.status(HttpStatus.Created).send(createdPostData);
    } catch (e) {
        errorsHandler(e, res);
    }
}

