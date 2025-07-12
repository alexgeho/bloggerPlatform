"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBlogPostsHandler = getBlogPostsHandler;
const blogs_service_1 = require("../../application/blogs.service");
const posts_service_1 = require("../../../posts/application/posts.service"); // путь скорректируй под себя
const sort_direction_1 = require("../../../core/types/sort-direction");
function getBlogPostsHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const blogId = req.params.blogId;
            const blog = yield blogs_service_1.blogsService.findByIdOrFail(blogId);
            if (!blog)
                return res.sendStatus(404); // 404 если блог не найден
            // Параметры пагинации и сортировки
            const pageNumber = +(req.query.pageNumber || 1);
            const pageSize = +(req.query.pageSize || 10);
            const sortBy = typeof req.query.sortBy === 'string' ? req.query.sortBy : 'createdAt';
            // Ограничиваем sortDirection только значениями из enum!
            const rawSortDirection = typeof req.query.sortDirection === 'string' ? req.query.sortDirection : sort_direction_1.SortDirection.Desc;
            const sortDirection = rawSortDirection === sort_direction_1.SortDirection.Asc ? sort_direction_1.SortDirection.Asc : sort_direction_1.SortDirection.Desc;
            // Сервис
            const postsPage = yield posts_service_1.postsService.findAllByBlogId(blogId, pageNumber, pageSize, sortBy, sortDirection);
            // Возвращаем результат
            res.status(200).json(postsPage);
        }
        catch (e) {
            res.sendStatus(500);
        }
    });
}
