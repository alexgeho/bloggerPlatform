import express, {Express} from "express";
import {db} from './db/in-memory.db';
import {HttpStatus} from "./core/types/http-statuses";
import {blog} from './blogs/types/blog';
import {BlogViewModel} from './blogs/types/blog';
import {Request, Response} from 'express';
import {blogInputDtoValidation} from './blogs/validation/blogInputDtoValidation';


import {createErrorMessages} from './core/utils/error.utils';
import {blogsRouter} from "./routers/blogs.router";
import {testingRouter} from "./routers/testing.router";


export const setupApp = (app: Express) => {
    app.use(express.json()); // middleware для парсинга JSON в теле запроса

    // основной роут
    app.get("/", (req, res) => {
        res.status(200).send("Hello world Bitau!");
    });


    app.use('/blogs', blogsRouter);

    app.delete('/testing/all-data', testingRouter);


    return app;
};