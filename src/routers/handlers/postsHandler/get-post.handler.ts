import {Request, Response} from 'express';
import {HttpStatus} from '../../../core/types/http-statuses';
import {createErrorMessages} from '../../../core/utils/error.utils';
import {postsRepository} from "../../../posts/repositories/posts.repository";

export function getPostHandler(req: Request, res: Response) {

    //  const blog = db.blogs.find(b => b.id === +req.params.id);

    const id = parseInt(req.params.id);
    const blog = postsRepository.findById(id);

    if (!blog) {
        res
            .status(HttpStatus.NotFound)
            .send(createErrorMessages([{field: 'id', message: 'Blog not found'}]));

        return;
    }

    res.status(200).send({
        ...blog,
        id: String(blog.id),
    });
}

