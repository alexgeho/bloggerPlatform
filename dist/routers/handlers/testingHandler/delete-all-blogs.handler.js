"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAllBlogHandler = deleteAllBlogHandler;
const http_statuses_1 = require("../../../core/types/http-statuses");
const blogs_repository_1 = require("../../../blogs/repositories/blogs.repository");
function deleteAllBlogHandler(req, res) {
    blogs_repository_1.blogsRepository.deleteAll();
    res.sendStatus(http_statuses_1.HttpStatus.NoContent);
}
