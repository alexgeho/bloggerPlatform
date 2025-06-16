"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupApp = void 0;
const express_1 = __importDefault(require("express"));
const blogs_router_1 = require("./routers/blogs.router");
const testing_router_1 = require("./routers/testing.router");
const setupApp = (app) => {
    app.use(express_1.default.json()); // middleware для парсинга JSON в теле запроса
    // основной роут
    app.get("/", (req, res) => {
        res.status(200).send("Hello world Bitau!");
    });
    app.use('/blogs', blogs_router_1.blogsRouter);
    app.delete('/testing/all-data', testing_router_1.testingRouter);
    return app;
};
exports.setupApp = setupApp;
