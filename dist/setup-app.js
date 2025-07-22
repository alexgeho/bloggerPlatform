"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupApp = void 0;
var express_1 = __importDefault(require("express"));
var blogs_router_1 = require("./blogs/routers/blogs.router");
var setup_swagger_1 = require("./core/swagger/setup-swagger");
var paths_1 = require("./core/paths/paths");
var testing_router_1 = require("./testing/routers/testing.router");
var posts_router_1 = require("./posts/routers/posts.router");
var user_router_1 = require("./users/routers/user.router");
var auth_router_1 = require("./auth/routers/auth.router");
var setupApp = function (app) {
    console.log("=== setupApp CALLED ===");
    app.use(express_1.default.json()); // middleware для парсинга JSON в теле запроса
    // основной роут
    app.get("/", function (req, res) {
        res.status(200).send("Hello world Bitau!");
    });
    // app.all('*', (req, res) => {
    //     console.log(req.url)
    // })
    console.log('Монтирую blogsRouter по адресу:', paths_1.BLOGS_PATH);
    app.use(paths_1.BLOGS_PATH, blogs_router_1.blogsRouter);
    app.use(paths_1.TESTING_PATH, testing_router_1.testingRouter);
    app.use(paths_1.POSTS_PATH, posts_router_1.postsRouter);
    app.use(paths_1.USERS_PATH, user_router_1.usersRouter);
    app.use(paths_1.AUTH_PATH, auth_router_1.authRouter);
    (0, setup_swagger_1.setupSwagger)(app);
    return app;
};
exports.setupApp = setupApp;
//# sourceMappingURL=setup-app.js.map