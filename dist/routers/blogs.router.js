"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogsRouter = void 0;
const express_1 = require("express");
const get_blog_list_handler_1 = require("./handlers/get-blog-list.handler");
const post_blog_handler_1 = require("./handlers/post-blog.handler");
const get_blog_handler_1 = require("./handlers/get-blog.handler");
const update_driver_handler_1 = require("./handlers/update-driver.handler");
exports.blogsRouter = (0, express_1.Router)({});
exports.blogsRouter
    .get("/", get_blog_list_handler_1.getBlogListHandler)
    .post("/", post_blog_handler_1.createBlogHandler)
    .get("/:id", get_blog_handler_1.getBlogHandler)
    .put('/:id', update_driver_handler_1.updateBlogHandler);
