import {Request, Response} from 'express';
import {HttpStatus} from '../../../core/types/http-statuses';
import {createErrorMessages} from '../../../core/utils/error.utils';
import {blogsRepository} from "../../../blogs/repositories/blogs.repository";

export function deleteBlogHandler(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const blog = blogsRepository.findById(id);

    if (!blog) {
        res
            .status(HttpStatus.NotFound)
            .send(createErrorMessages([{ field: 'id', message: 'Blog not found' }]));
        return;
    }

    blogsRepository.delete(id);
    res.sendStatus(HttpStatus.NoContent);
}
