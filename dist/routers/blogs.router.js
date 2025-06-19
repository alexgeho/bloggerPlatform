"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogsRouter = void 0;
const express_1 = require("express");
const get_blog_list_handler_1 = require("./handlers/get-blog-list.handler");
const post_blog_handler_1 = require("./handlers/post-blog.handler");
const get_blog_handler_1 = require("./handlers/get-blog.handler");
const update_driver_handler_1 = require("./handlers/update-driver.handler");
const params_id_validation_middleware_1 = require("../core/middlewares/validation/params-id.validation-middleware");
const input_validtion_result_middleware_1 = require("../core/middlewares/validation/input-validtion-result.middleware");
const blog_input_dto_validation_middlewares_1 = require("../blogs/validation/blog.input-dto.validation-middlewares");
const delete_blog_handler_1 = require("./handlers/delete-blog.handler");
exports.blogsRouter = (0, express_1.Router)({});
exports.blogsRouter
    .get("/", get_blog_list_handler_1.getBlogListHandler)
    .post("/", blog_input_dto_validation_middlewares_1.blogInputDtoValidation, input_validtion_result_middleware_1.inputValidationResultMiddleware, post_blog_handler_1.createBlogHandler)
    .get("/:id", params_id_validation_middleware_1.idValidation, input_validtion_result_middleware_1.inputValidationResultMiddleware, get_blog_handler_1.getBlogHandler)
    .put('/:id', params_id_validation_middleware_1.idValidation, blog_input_dto_validation_middlewares_1.blogInputDtoValidation, input_validtion_result_middleware_1.inputValidationResultMiddleware, update_driver_handler_1.updateBlogHandler)
    .delete('/testing/all-data', params_id_validation_middleware_1.idValidation, blog_input_dto_validation_middlewares_1.blogInputDtoValidation, input_validtion_result_middleware_1.inputValidationResultMiddleware, delete_blog_handler_1.deleteBlogHandler);
