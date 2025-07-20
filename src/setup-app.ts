import express, {Express} from "express";
import {blogsRouter} from "./blogs/routers/blogs.router";
import { setupSwagger } from "./core/swagger/setup-swagger"
import {BLOGS_PATH, POSTS_PATH, TESTING_PATH, USERS_PATH} from "./core/paths/paths";
import {testingRouter} from "./testing/routers/testing.router";
import {postsRouter} from "./posts/routers/posts.router";
import {usersRouter} from "./users/routers/user.router";

export const setupApp = (app: Express) => {
    console.log("=== setupApp CALLED ===");
    app.use(express.json()); // middleware для парсинга JSON в теле запроса

    // основной роут
    app.get("/", (req, res) => {
        res.status(200).send("Hello world Bitau!");
    });
    console.log('Монтирую blogsRouter по адресу:', BLOGS_PATH)

    app.use(BLOGS_PATH, blogsRouter);
    app.use(TESTING_PATH, testingRouter);
    app.use(POSTS_PATH, postsRouter);
    app.use(USERS_PATH, usersRouter);

   setupSwagger(app);


    return app;
};