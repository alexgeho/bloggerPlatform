import { Request, Response } from 'express';
import { HttpStatus } from '../../../../core/types/http-statuses';
import { mapToBlogOutput } from '../mappers/map-to-blog-output.util';
import { blogsService } from '../../application/blogs.service';
import { postsService} from "../../../posts/application/posts.service";
import { errorsHandler } from '../../../../core/errors/errors.handler';
import {blogsQwRepository} from "../../repositories/blogsQwRepository";

export async function getBlogHandler(
    req: Request<{ id: string }>,
    res: Response,
) {
    try {
        const id = req.params.id;

        const blog = await blogsQwRepository.findByIdOrFail(id);

        const blogOutput = mapToBlogOutput(blog);

        res.status(HttpStatus.Ok).send(blogOutput);
    } catch (e: unknown) {
        errorsHandler(e, res);
    }
}
