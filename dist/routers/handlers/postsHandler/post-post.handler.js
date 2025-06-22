"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPostHandler = createPostHandler;
const http_statuses_1 = require("../../../core/types/http-statuses");
const in_memory_db_1 = require("../../../db/in-memory.db");
const posts_repository_1 = require("../../../posts/repositories/posts.repository");
const blogs_repository_1 = require("../../../blogs/repositories/blogs.repository");
function createPostHandler(req, res) {
    // 1. Найти блог по blogId из тела запроса
    const blog = blogs_repository_1.blogsRepository.findById(+req.body.blogId);
    if (!blog) {
        return res.status(400).send({ errorMessages: [{ field: "blogId", message: "Blog not found" }] });
    }
    const newPost = {
        id: in_memory_db_1.db.posts.length ? in_memory_db_1.db.posts[in_memory_db_1.db.posts.length - 1].id + 1 : 1,
        title: req.body.title,
        shortDescription: req.body.shortDescription,
        content: req.body.content,
        blogId: req.body.blogId,
        blogName: blog.name
    };
    posts_repository_1.postsRepository.create(newPost);
    res.status(http_statuses_1.HttpStatus.Created).send(newPost);
}
