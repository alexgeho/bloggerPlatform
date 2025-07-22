import { Request, Response } from "express";
import { blogsService } from "../../application/blogs.service";
import { postsService } from "../../../posts/application/posts.service";
import {RepositoryNotFoundError} from "../../../core/errors/repository-not-found.error";
import {errorsHandler} from "../../../core/errors/errors.handler";

export async function getBlogPostsHandler(req:Request, res:Response ) {
    try {
        const blogId = req.params.blogId;
        // Проверка, что блог существует
        await blogsService.findByIdOrFail(blogId);

        // Параметры пагинации/сортировки
        const pageNumber = +(req.query.pageNumber || 1);
        const pageSize = +(req.query.pageSize || 10);
        const sortBy = typeof req.query.sortBy === "string" ? req.query.sortBy : "createdAt";
        const sortDirection = req.query.sortDirection === "asc" ? "asc" : "desc";

        // Получение постов
        const postsPage = await postsService.findAllByBlogId(
            blogId, pageNumber, pageSize, sortBy, sortDirection
        );

        // Форматируем ответ как требует Swagger
        const result = {
            pagesCount: Math.ceil(postsPage.totalCount / pageSize),
            page: pageNumber,
            pageSize: pageSize,
            totalCount: postsPage.totalCount,
            items: postsPage.items.map(p => ({
                id: p._id ? p._id.toString() : p._id,
                title: p.title,
                shortDescription: p.shortDescription,
                content: p.content,
                blogId: p.blogId,
                blogName: p.blogName,
                createdAt: p.createdAt,
            }))
        };

        return res.status(200).json(result);
    } catch (e) {
        console.log(e, ' error')

        console.log(e, ' here')
        console.log(e instanceof  Error, ' is error')
        // Если блог не найден — 404, иначе просто пробрасываем ошибку дальше (или можно логировать)
        if (e instanceof RepositoryNotFoundError) {
            console.log('handled')
            res.status(e.status).send({ message: 'Blog not found' });
            return;
        } else {


            errorsHandler(e, res); // <-- если вдруг какая-то другая непредвиденная ошибка
        }
    }

}
