import {Request, Response} from 'express';
import {db} from '../../db/in-memory.db';
import {HttpStatus} from '../../core/types/http-statuses';
import {createErrorMessages} from '../../core/utils/error.utils';
import {BlogViewModel} from "../../blogs/types/blog";
import {blogsRepository} from "../../blogs/repositories/blogs.repository";

export function getBlogHandler(req: Request, res: Response) {

    //  const blog = db.blogs.find(b => b.id === +req.params.id);

    const id = parseInt(req.params.id);
    const blog = blogsRepository.findById(id);

    if (!blog) {
        res
            .status(HttpStatus.NotFound)
            .send(createErrorMessages([{field: 'id', message: 'Blog not found bitau'}]));

        return;
    }

    res.status(200).send({
        ...blog,
        id: String(blog.id),
    });
}