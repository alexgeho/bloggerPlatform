import { Request, Response } from 'express';
import { blogsService } from '../../application/blogs.service';
import { postsService } from '../../../posts/application/posts.service'; // путь скорректируй под себя
import { SortDirection } from '../../../core/types/sort-direction';

export async function getBlogPostsHandler(req: Request, res: Response) {
    try {
        const blogId: string = req.params.blogId;
        const blog = await blogsService.findByIdOrFail(blogId);
        if (!blog) return res.sendStatus(404); // 404 если блог не найден

        // Параметры пагинации и сортировки
        const pageNumber = +(req.query.pageNumber || 1);
        const pageSize = +(req.query.pageSize || 10);
        const sortBy = typeof req.query.sortBy === 'string' ? req.query.sortBy : 'createdAt';
        // Ограничиваем sortDirection только значениями из enum!

        const rawSortDirection = typeof req.query.sortDirection === 'string' ? req.query.sortDirection : SortDirection.Desc;
        const sortDirection: SortDirection =
            rawSortDirection === SortDirection.Asc ? SortDirection.Asc : SortDirection.Desc;

        // Сервис
        const postsPage = await postsService.findAllByBlogId(
            blogId,
            pageNumber,
            pageSize,
            sortBy,
            sortDirection
        );

        // Возвращаем результат
        res.status(200).json(postsPage);
    } catch (e) {
        res.sendStatus(500);
    }
}
