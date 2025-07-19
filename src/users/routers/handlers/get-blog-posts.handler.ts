import { Request, Response } from "express";
import { userService } from "../../application/user.service";
import { postsService } from "../../../posts/application/posts.service";

export async function getBlogPostsHandler(req:Request, res:Response ) {
    try {
        const blogId = req.params.blogId;
        // Проверка, что блог существует
        await userService.findByIdOrFail(blogId);

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
    } catch (e: any) {
        if (e.message === 'Blog not exist') return res.sendStatus(404);
        return res.sendStatus(500);
    }

}
