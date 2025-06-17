"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBlogHandler = createBlogHandler;
const http_statuses_1 = require("../../core/types/http-statuses");
const error_utils_1 = require("../../core/utils/error.utils");
const in_memory_db_1 = require("../../db/in-memory.db");
const blogInputDtoValidation_1 = require("../../blogs/validation/blogInputDtoValidation");
function createBlogHandler(req, res) {
    const errors = (0, blogInputDtoValidation_1.blogInputDtoValidation)(req.body);
    if (errors.length > 0) {
        res.status(http_statuses_1.HttpStatus.BadRequest).send((0, error_utils_1.createErrorMessages)(errors));
    }
    //1) проверяем приходящие данные на валидность
    //2) создаем newBlog
    const newBlog = {
        id: in_memory_db_1.db.blogs.length ? in_memory_db_1.db.blogs[in_memory_db_1.db.blogs.length - 1].id + 1 : 1,
        name: req.body.name,
        description: req.body.description,
        websiteUrl: req.body.websiteUrl
    };
    //3) добавляем newBlog в БД
    in_memory_db_1.db.blogs.push(newBlog);
    // Возвращаем копию newBlog, но id как строка
    res.status(http_statuses_1.HttpStatus.Created).send(Object.assign(Object.assign({}, newBlog), { id: String(newBlog.id) }));
}
