"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogsRouter = void 0;
const express_1 = require("express");
const blogInputDtoValidation_1 = require("../blogs/validation/blogInputDtoValidation");
const http_statuses_1 = require("../core/types/http-statuses");
const error_utils_1 = require("../core/utils/error.utils");
const in_memory_db_1 = require("../db/in-memory.db");
exports.blogsRouter = (0, express_1.Router)({});
exports.blogsRouter
    .get("/", (req, res) => {
    // возвращаем все блоги
    res.status(200).send(in_memory_db_1.db.blogs.map(blog => (Object.assign(Object.assign({}, blog), { id: String(blog.id) }))));
})
    .post("/", (req, res) => {
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
})
    .get("/:id", (req, res) => {
    const blog = in_memory_db_1.db.blogs.find(b => b.id === +req.params.id);
    if (!blog) {
        res.sendStatus(404);
        return;
    }
    res.status(200).send(Object.assign(Object.assign({}, blog), { id: String(blog.id) }));
})
    .put('/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = in_memory_db_1.db.blogs.findIndex((v) => v.id === id);
    if (index === -1) {
        res
            .status(http_statuses_1.HttpStatus.NotFound)
            .send((0, error_utils_1.createErrorMessages)([{ field: 'id', message: 'Blog not found' }]));
        return;
    }
    // Оценить!
    const errors = (0, blogInputDtoValidation_1.blogInputDtoValidation)(req.body);
    if (errors.length > 0) {
        res.status(http_statuses_1.HttpStatus.BadRequest).send((0, error_utils_1.createErrorMessages)(errors));
        return;
    }
    const blog = in_memory_db_1.db.blogs[index];
    blog.name = req.body.name;
    blog.description = req.body.description;
    blog.websiteUrl = req.body.websiteUrl;
    res.status(200).send({ message: "Blog was updated successfully" });
});
