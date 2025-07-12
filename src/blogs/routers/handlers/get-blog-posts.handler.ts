import { Request, Response } from 'express';
import { blogsService } from '../../application/blogs.service';
import { postsService } from '../../../posts/application/posts.service'; // путь скорректируй под себя
import { mapToPostListPaginatedOutput } from '../../../posts/routers/mappers/map-to-post-list-paginated-output.util';

export async function getBlogPostsHandler(req: Request, res: Response) {
    try {
        const blogId = req.params.blogId;

        // 1. Проверка на существование блога
        const blog = await blogsService.findByIdOrFail(blogId);
        if (!blog) {
            return res.sendStatus(404); // Возвращаем 404 если блога нет
        }

        // 2. Получаем параметры пагинации и сортировки
        const pageNumber = +(req.query.pageNumber || 1);
        const pageSize = +(req.query.pageSize || 10);
        const sortBy = req.query.sortBy || 'createdAt';
        const sortDirection = req.query.sortDirection || 'desc';

        // 3. Получаем посты через сервис
        const postsPage = await postsService.findAllByBlogId(
            blogId, pageNumber, pageSize, sortBy, sortDirection
        );

        // 4. Маппим и возвращаем результат
        const output = mapToPostListPaginatedOutput(
            postsPage.items,
            {
                pageNumber,
                pageSize,
                totalCount: postsPage.totalCount
            }
        );
        res.status(200).json(output);

    } catch (e) {
        res.sendStatus(500); // или кастомный errorHandler
    }
}
