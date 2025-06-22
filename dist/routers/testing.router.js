"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testingRouter = void 0;
const express_1 = require("express");
const super_admin_guard_middleware_1 = require("../auth/middlewares/super-admin.guard-middleware");
const delete_all_blogs_handler_1 = require("./handlers/testingHandler/delete-all-blogs.handler");
exports.testingRouter = (0, express_1.Router)({});
exports.testingRouter
    .delete('/all-data', super_admin_guard_middleware_1.superAdminGuardMiddleware, delete_all_blogs_handler_1.deleteAllBlogHandler);
