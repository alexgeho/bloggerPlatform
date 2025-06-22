"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBlogHandler = createBlogHandler;
const http_statuses_1 = require("../../../core/types/http-statuses");
const in_memory_db_1 = require("../../../db/in-memory.db");
const blogs_repository_1 = require("../../../blogs/repositories/blogs.repository");
function createBlogHandler(req, res) {
    const newBlog = {
        id: in_memory_db_1.db.blogs.length ? in_memory_db_1.db.blogs[in_memory_db_1.db.blogs.length - 1].id + 1 : 1,
        name: req.body.name,
        description: req.body.description,
        websiteUrl: req.body.websiteUrl
    };
    blogs_repository_1.blogsRepository.create(newBlog);
    res.status(http_statuses_1.HttpStatus.Created).send(newBlog);
}
