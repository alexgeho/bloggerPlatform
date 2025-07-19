import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/types/http-statuses';
import { mapToBlogOutput } from '../mappers/map-to-blog-output.util';
import { userService } from '../../application/user.service';
import { postsService} from "../../../posts/application/posts.service";
import { errorsHandler } from '../../../core/errors/errors.handler';

export async function getBlogHandler(
    req: Request<{ id: string }>,
    res: Response,
) {
    try {
        const id = req.params.id;

        const blog = await userService.findByIdOrFail(id);

        const blogOutput = mapToBlogOutput(blog);

        res.status(HttpStatus.Ok).send(blogOutput);
    } catch (e: unknown) {
        errorsHandler(e, res);
    }
}
