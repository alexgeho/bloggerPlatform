import { Request, Response } from "express";
import { blogsService } from "../../application/blogs.service";
import { postsService } from "../../../posts/application/posts.service";
import { RepositoryNotFoundError } from "../../../../core/errors/repository-not-found.error";
import { errorsHandler } from "../../../../core/errors/errors.handler";
import { PostDocument } from "../../../posts/domain/post.mangoose";
import {likesService} from "../../../likes/likes.serviceAndRep";

export async function getBlogPostsHandler(req: Request, res: Response) {
    try {
        const blogId = req.params.blogId;

        // ✅ Проверяем, существует ли блог (иначе 404)
        await blogsService.findByIdOrFail(blogId);

        // ✅ userId — извлекаем из middleware (опционально)
        const userId = req.user?.userId;

        // ✅ Параметры пагинации и сортировки
        const pageNumber = +(req.query.pageNumber || 1);
        const pageSize = +(req.query.pageSize || 10); // 👈 правильный дефолт, не 15
        const sortBy = typeof req.query.sortBy === "string" ? req.query.sortBy : "createdAt";
        const sortDirection = req.query.sortDirection === "asc" ? "asc" : "desc";

        // ✅ Получаем посты блога
        const postsPage = await postsService.findAllByBlogId(
            blogId,
            pageNumber,
            pageSize,
            sortBy,
            sortDirection
        );

        // ✅ Добавляем блок extendedLikesInfo к каждому посту
        const itemsWithLikes = await Promise.all(
            postsPage.items.map(async (p: PostDocument) => {
                const extendedLikesInfo = await likesService.findAllLikesOnPost(p._id.toString(), userId);
                return {
                    id: p._id.toString(),
                    title: p.title,
                    shortDescription: p.shortDescription,
                    content: p.content,
                    blogId: p.blogId,
                    blogName: p.blogName,
                    createdAt: p.createdAt,
                    extendedLikesInfo, // 👈 сюда добавляем лайки
                };
            })
        );

        // ✅ Формируем итоговый ответ (как требует Swagger и автотест)
        const result = {
            pagesCount: Math.ceil(postsPage.totalCount / pageSize),
            page: pageNumber,
            pageSize,
            totalCount: postsPage.totalCount,
            items: itemsWithLikes,
        };

        return res.status(200).json(result);
    } catch (e) {
        if (e instanceof RepositoryNotFoundError) {
            return res.status(e.status).send({ message: "Blog not found" });
        }

        errorsHandler(e, res);
    }
}
