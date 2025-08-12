import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { blogsRouter } from './features/blogs/routers/blogs.router';
import { postsRouter } from './features/posts/routers/posts.router';
import { usersRouter } from './features/users/routers/user.router';
import { commentsRouter } from './features/comments/routers/comments.router';
import { testingRouter } from './features/testing/routers/testing.router';
import { authRouter } from './features/auth/routers/auth.router';
import { setupSwagger } from './core/swagger/setup-swagger';
import { AUTH_PATH, BLOGS_PATH, COMMENTS_PATH, POSTS_PATH, TESTING_PATH, USERS_PATH } from './core/paths/paths';
import { ENV } from './core/config/env';
import type { ErrorRequestHandler } from 'express';


export const setupApp = (app: Express) => {
    app.use(cors({ origin: ENV.ORIGIN, credentials: true }));
    app.use(express.json());
    app.use(cookieParser()); // why: чтобы читать/ставить refresh cookie

    app.get('/', (_req, res) => {
        res.status(200).send('Hello world Bitau!');
    });

    app.use(BLOGS_PATH, blogsRouter);
    app.use(TESTING_PATH, testingRouter);
    app.use(POSTS_PATH, postsRouter);
    app.use(USERS_PATH, usersRouter);
    app.use(AUTH_PATH, authRouter);
    app.use(COMMENTS_PATH, commentsRouter);

    setupSwagger(app);

    const errorMiddleware: ErrorRequestHandler = (err, _req, res, _next) => {
        if (process.env.NODE_ENV !== 'production') {
            // eslint-disable-next-line no-console
            console.error(err);
        }
        res.status(500).send({ message: 'Internal Server Error' });
    };
    app.use(errorMiddleware);


return app;
};
