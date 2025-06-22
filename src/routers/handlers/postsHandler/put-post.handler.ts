import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/types/http-statuses';
import { createErrorMessages } from '../../../core/utils/error.utils';
import {postInputDtoValidation} from '../../../posts/validation/post.input-dto.validation-middlewares';
import {PostInputDto} from '../../../posts/dto/post.input-dto';
import {postsRepository} from '../../../posts/repositories/posts.repository';

export function putPostHandler(
    req: Request <{ id: string }, {}, PostInputDto>,
    res: Response
) {
    const id = parseInt(req.params.id);


    const blog = postsRepository.findById(id);

    if (!blog) {
        res
            .status(HttpStatus.NotFound)
            .send(createErrorMessages([{ field: 'id', message: 'Post not found' }]));
        return;
    }

    postsRepository.update(id, req.body);
    res.sendStatus(HttpStatus.Created);


}

