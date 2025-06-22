import express, {Express} from "express";
import {blogsRouter} from "./routers/blogs.router";
import { setupSwagger } from "./core/swagger/setup-swagger"
import {BLOGS_PATH} from "./core/paths/paths";


export const setupApp = (app: Express) => {
    app.use(express.json()); // middleware для парсинга JSON в теле запроса

    // основной роут
    app.get("/", (req, res) => {
        res.status(200).send("Hello world Bitau!");
    });

    app.use(BLOGS_PATH, blogsRouter);

    setupSwagger(app);
    return app;
};