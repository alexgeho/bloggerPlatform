import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/types/http-statuses';
import { createErrorMessages } from '../../../core/utils/error.utils';
import {blogInputDtoValidation} from "../../../blogs/validation/blogInputDtoValidation";
import {BlogInputDto} from "../../../blogs/dto/blog.input-dto";
import {blogsRepository} from "../../../blogs/repositories/blogs.repository";

export function updateBlogHandler(
    req: Request <{ id: string }, {}, BlogInputDto>,
 res: Response
) {
    const id = parseInt(req.params.id);
    const errors = blogInputDtoValidation(req.body);
    if (errors.length > 0) {
        res.status(HttpStatus.BadRequest).send(createErrorMessages(errors));
        return;
    }

    const blog = blogsRepository.findById(id);

    if (!blog) {
        res
            .status(HttpStatus.NotFound)
            .send(createErrorMessages([{ field: 'id', message: 'Vehicle not found' }]));
        return;
    }

    blogsRepository.update(id, req.body);
    res.sendStatus(HttpStatus.NoContent);


}

