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
const user_service_1 = require("../../application/user.service");
const posts_service_1 = require("../../../posts/application/posts.service");
function getBlogPostsHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const blogId = req.params.blogId;
            // Проверка, что блог существует
            yield user_service_1.userService.findByIdOrFail(blogId);
            // Параметры пагинации/сортировки
            const pageNumber = +(req.query.pageNumber || 1);
            const pageSize = +(req.query.pageSize || 10);
            const sortBy = typeof req.query.sortBy === "string" ? req.query.sortBy : "createdAt";
            const sortDirection = req.query.sortDirection === "asc" ? "asc" : "desc";
            // Получение постов
            const postsPage = yield posts_service_1.postsService.findAllByBlogId(blogId, pageNumber, pageSize, sortBy, sortDirection);
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
        }
        catch (e) {
            if (e.message === 'Blog not exist')
                return res.sendStatus(404);
            return res.sendStatus(500);
        }
    });
}
