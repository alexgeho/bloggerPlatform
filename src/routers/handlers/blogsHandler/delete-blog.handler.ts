import {Request, Response} from 'express';
import {HttpStatus} from '../../../core/types/http-statuses';
import {createErrorMessages} from '../../../core/utils/error.utils';
import {blogsRepository} from "../../../blogs/repositories/blogs.repository";

export async function deleteBlogHandler(req: Request, res: Response) {
    try {
        const id = req.params.id;
        const blog = await blogsRepository.findById(id);

        if (!blog) {
            res
                .status(HttpStatus.NotFound)
                .send(createErrorMessages([{ field: 'id', message: 'Blog not found' }]));
            return;
        }

    await blogsRepository.delete(id);
    res.sendStatus(HttpStatus.NoContent);
} catch (e: unknown) {
    res.sendStatus(HttpStatus.InternalServerError);
    }
}
