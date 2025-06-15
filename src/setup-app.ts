import express, { Express } from "express";
import {db} from './db/in-memory.db';
import {HttpStatus} from "./core/types/http-statuses";
import {blog} from './blogs/types/blog';
import { BlogViewModel } from './blogs/types/blog';
import { Request, Response } from 'express';
import { validateBlogInputDto } from './blogs/validation/blogInputDtoValidation';


import {createErrorMessages} from './core/utils/error.utils';



export const setupApp = (app: Express) => {
    app.use(express.json()); // middleware для парсинга JSON в теле запроса

    // основной роут
    app.get("/", (req, res) => {
        res.status(200).send("Hello world Bitau!");
    });

    app.get("/blogs", (req, res) => {
        // возвращаем все блоги
        res.status(200).send(
            db.blogs.map(blog => ({
                ...blog,
                id: String(blog.id)
            })));
    });

    app.post("/blogs", (req, res) => {

        // Validation

        const errors = validateBlogInputDto(req.body);

        //1) проверяем приходящие данные на валидность
        //2) создаем newBlog
        const newBlog: blog = {
            id: db.blogs.length ? db.blogs[db.blogs.length - 1].id + 1 : 1,
            name: req.body.name,
            description: req.body.description,
            websiteUrl: req.body.websiteUrl
        };

        //3) добавляем newBlog в БД
        db.blogs.push(newBlog);

       // Возвращаем копию newBlog, но id как строка
        res.status(HttpStatus.Created).send({
            ...newBlog,
            id: String(newBlog.id)
        });
    });

    app.get("/blogs/:id", (req: Request<{ id: string }>, res: Response<BlogViewModel | null>) => {
        const blog = db.blogs.find(b => b.id === +req.params.id);

        if (!blog) {
            res.sendStatus(404);
            return;
        }

        res.status(200).send({
            ...blog,
            id: String(blog.id),
        });
    });



app.put('/blogs/:id', (req: Request, res: Response) => {
        const id = parseInt(req.params.id);
        const index = db.blogs.findIndex((v) => v.id === id);

        if (index === -1) {
            res
                .status(HttpStatus.NotFound)
                .send(
                    createErrorMessages([{ field: 'id', message: 'Blog not found' }]),
                );


            return;
        }

    const errors = validateBlogInputDto(req.body);
    if (errors.length > 0) {
        res.status(HttpStatus.BadRequest).send(createErrorMessages(errors));
        return;
    }

        const blog = db.blogs[index];

        blog.name = req.body.name;
        blog.description = req.body.description;
        blog.websiteUrl = req.body.websiteUrl;

    res.status(200).send({ message: "Blog was updated successfully" });
    })


    app.delete('/testing/all-data', (req, res) => {
        console.log('DELETE /testing/all-data called');
        db.blogs.length = 0; // очищаем все блоги
        res.sendStatus(HttpStatus.NoContent); // 204
    });


    return app;
};