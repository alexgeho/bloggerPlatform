import express, {Express, RequestHandler} from "express";
import {blogsRouter} from "./features/blogs/routers/blogs.router";
import { setupSwagger } from "./core/swagger/setup-swagger"
import {AUTH_PATH, BLOGS_PATH, COMMENTS_PATH, POSTS_PATH, TESTING_PATH, USERS_PATH} from "./core/paths/paths";
import {testingRouter} from "./features/testing/routers/testing.router";
import {postsRouter} from "./features/posts/routers/posts.router";
import {usersRouter} from "./features/users/routers/user.router";
import {commentsRouter} from "./features/comments/comments.router";
import {authRouter} from "./features/auth/routers/auth.router";

export const setupApp = (app: Express) => {
    console.log("=== setupApp CALLED ===");
    app.use(express.json());


    app.get("/", (req, res) => {
        res.status(200).send("Hello world Bitau!");
    });

    app.use(BLOGS_PATH, blogsRouter);
    app.use(TESTING_PATH, testingRouter);
    app.use(POSTS_PATH, postsRouter);
    app.use(USERS_PATH, usersRouter);
    app.use(AUTH_PATH, authRouter);
    app.use(COMMENTS_PATH, commentsRouter);



    setupSwagger(app);

    function errorHandler  (err: any, req: Request, res: Response)  {
        console.log(arguments, 'err midleware');
        console.log( 'req.url');
    }

    return app;
};