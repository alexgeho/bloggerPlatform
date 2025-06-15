"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupApp = void 0;
const express_1 = __importDefault(require("express"));
const in_memory_db_1 = require("./db/in-memory.db");
const http_statuses_1 = require("./core/types/http-statuses");
const blog_input_dto_1 = require("./blogs/dto/blog.input-dto");
const error_utils_1 = require("./core/utils/error.utils");
const setupApp = (app) => {
    app.use(express_1.default.json()); // middleware для парсинга JSON в теле запроса
    // основной роут
    app.get("/", (req, res) => {
        res.status(200).send("Hello world Bitau!");
    });
    app.get("/blogs", (req, res) => {
        // возвращаем все блоги
        res.status(200).send(in_memory_db_1.db.blogs.map(blog => (Object.assign(Object.assign({}, blog), { id: String(blog.id) }))));
    });
    app.post("/blogs", (req, res) => {
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
    });
    app.get("/blogs/:id", (req, res) => {
        const blog = in_memory_db_1.db.blogs.find(b => b.id === +req.params.id);
        if (!blog) {
            res.sendStatus(404);
            return;
        }
        res.status(200).send(Object.assign(Object.assign({}, blog), { id: String(blog.id) }));
    });
    app.put('/blogs/:id', (req, res) => {
        const id = parseInt(req.params.id);
        const index = in_memory_db_1.db.blogs.findIndex((v) => v.id === id);
        if (index === -1) {
            res
                .status(http_statuses_1.HttpStatus.NotFound)
                .send((0, error_utils_1.createErrorMessages)([{ field: 'id', message: 'Blog not found' }]));
            return;
        }
        const errors = (0, blog_input_dto_1.validateBlogInputDto)(req.body);
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
    app.delete('/testing/all-data', (req, res) => {
        console.log('DELETE /testing/all-data called');
        in_memory_db_1.db.blogs.length = 0; // очищаем все блоги
        res.sendStatus(http_statuses_1.HttpStatus.NoContent); // 204
    });
    return app;
};
exports.setupApp = setupApp;
