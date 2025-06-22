import {Request, Response} from 'express';
import {HttpStatus} from '../../../core/types/http-statuses';
import {blogsRepository} from "../../../blogs/repositories/blogs.repository";

export function deleteAllBlogHandler(req: Request, res: Response) {

    blogsRepository.deleteAll();
    res.sendStatus(HttpStatus.NoContent);
}
