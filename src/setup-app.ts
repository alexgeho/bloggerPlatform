import type {ErrorRequestHandler, NextFunction} from 'express';
import express, {Express} from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import {blogsRouter} from './features/blogs/routers/blogs.router';
import {postsRouter} from './features/posts/routers/posts.router';
import {usersRouter} from './features/users/routers/user.router';
import {commentsRouter} from './features/comments/routers/comments.router';
import {testingRouter} from './features/testing/routers/testing.router';
import {authRouter} from './features/auth/routers/auth.router';
import {setupSwagger} from './core/swagger/setup-swagger';
import {
    AUTH_PATH,
    BLOGS_PATH,
    COMMENTS_PATH,
    POSTS_PATH,
    SECURITY_DEVICES_PATH,
    TESTING_PATH,
    USERS_PATH
} from './core/paths/paths';

// 🆕 устройства: DI и роутер безопасности
import {devicesRouter} from './features/auth/routers/security-devices.router';
import {ENV} from "./core/config/env";


const loggerMiddleware = (req: Request, res: Response, next: NextFunction) => {
    console.log('-------------------')
    console.log(req.url, 'url')
    console.log(req.body, 'body');
    // console.log((req.cookies) as unknown as { cookies: any}, ' cookies')

    return next();

}


export const setupApp = (app: Express) => {
    // 🆕 корректный req.ip за прокси
    app.set('trust proxy', true);

    app.use(cors({ origin: ENV.ORIGIN, credentials: true }));
    app.use(express.json());
    app.use(cookieParser()); // why: чтобы читать/ставить refresh cookie

    // @ts-ignore
    app.use(loggerMiddleware)
    // // 🆕 DI устройств (репозиторий + сервис) + передать в authService
    // const deviceRepo = new MongoDeviceSessionsRepository(deviceSessionsCollection);
    // const devicesService = new DevicesService(deviceRepo);
    // authService.setDevices(devicesService); // why: не меняем хендлеры, вшиваем внутрь сервиса

    app.get('/', (_req, res) => { res.status(200).send('Hello world Bitau!'); });

    app.use(BLOGS_PATH, blogsRouter);
    app.use(TESTING_PATH, testingRouter);
    app.use(POSTS_PATH, postsRouter);
    app.use(USERS_PATH, usersRouter);
    app.use(AUTH_PATH, authRouter);
    app.use(COMMENTS_PATH, commentsRouter);
    app.use(SECURITY_DEVICES_PATH, devicesRouter);

    setupSwagger(app);

    const errorMiddleware: ErrorRequestHandler = (err, _req, res, _next) => {
        if (process.env.NODE_ENV !== 'production') { console.error(err); }
        res.status(500).send({ message: 'Internal Server Error' });
    };
    app.use(errorMiddleware);

    return app;
};
