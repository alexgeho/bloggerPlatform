import express, {Express} from "express";
import {blogsRouter} from "./routers/blogs.router";
import {testingRouter} from "./routers/testing.router";
import { setupSwagger } from "./core/swagger/setup-swagger"
import {DRIVERS_PATH, TESTING_PATH} from "./core/paths/paths";


export const setupApp = (app: Express) => {
    app.use(express.json()); // middleware для парсинга JSON в теле запроса

    // основной роут
    app.get("/", (req, res) => {
        res.status(200).send("Hello world Bitau!");
    });

    app.use(DRIVERS_PATH, blogsRouter);

    app.delete(TESTING_PATH, testingRouter);

    setupSwagger(app);
    return app;
};