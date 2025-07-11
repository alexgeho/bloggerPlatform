import express, {Express} from "express";
import {blogsRouter} from "./blogs/routers/blogs.router";
import { setupSwagger } from "./core/swagger/setup-swagger"
import {BLOGS_PATH, POSTS_PATH, TESTING_PATH} from "./core/paths/paths";
import {testingRouter} from "./testing/routers/testing.router";
import {postsRouter} from "./posts/routers/posts.router";


export const setupApp = (app: Express) => {
    app.use(express.json()); // middleware для парсинга JSON в теле запроса

    // основной роут
    app.get("/", (req, res) => {
        res.status(200).send("Hello world Bitau!");
    });

    app.use(BLOGS_PATH, blogsRouter);
    app.use(TESTING_PATH, testingRouter);
    app.use(POSTS_PATH, postsRouter);

    setupSwagger(app);
    return app;
};