import {NextFunction, Request, Response} from 'express';
import { HttpStatus } from '../../../../core/types/http-statuses';
import { errorsHandler } from '../../../../core/errors/errors.handler';
import { postsService } from '../../../posts/application/posts.service';
import {blogsService} from "../../application/blogs.service";
import {RepositoryNotFoundError} from "../../../../core/errors/repository-not-found.error";

export async function postBlogPostHandler(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const blogId = req.params.blogId;

        // Проверяем существование блога
        const blog = await blogsService.findByIdOrFail(blogId);
        if (!blog) {
            res.status(HttpStatus.NotFound).send({ message: 'Blog not found' });
            return;
        }

        // Объединяем blogId из params и всё из body
        const createdPostData = await postsService.create({
            ...req.body,
            blogId,
        });

        res.status(HttpStatus.Created).send(createdPostData);
    } catch (e) {

        // Если блог не найден — 404, иначе просто пробрасываем ошибку дальше (или можно логировать)
        if (e instanceof RepositoryNotFoundError) {
            res.status(e.status).send({ message: 'Blog not found' });
            return;
        } else {


            errorsHandler(e, res); // <-- если вдруг какая-то другая непредвиденная ошибка
        }
    }
}