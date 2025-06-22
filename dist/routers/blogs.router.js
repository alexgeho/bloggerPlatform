"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogsRouter = void 0;
const express_1 = require("express");
const get_blog_list_handler_1 = require("./handlers/blogsHandler/get-blog-list.handler");
const post_blog_handler_1 = require("./handlers/blogsHandler/post-blog.handler");
const get_blog_handler_1 = require("./handlers/blogsHandler/get-blog.handler");
const put_blog_handler_1 = require("./handlers/blogsHandler/put-blog.handler");
const params_id_validation_middleware_1 = require("../core/middlewares/validation/params-id.validation-middleware");
const input_validtion_result_middleware_1 = require("../core/middlewares/validation/input-validtion-result.middleware");
const blog_input_dto_validation_middlewares_1 = require("../blogs/validation/blog.input-dto.validation-middlewares");
const delete_blog_handler_1 = require("./handlers/blogsHandler/delete-blog.handler");
const super_admin_guard_middleware_1 = require("../auth/middlewares/super-admin.guard-middleware");
exports.blogsRouter = (0, express_1.Router)({});
exports.blogsRouter
    .get("/", get_blog_list_handler_1.getBlogListHandler)
    .post("/", super_admin_guard_middleware_1.superAdminGuardMiddleware, blog_input_dto_validation_middlewares_1.blogInputDtoValidation, input_validtion_result_middleware_1.inputValidationResultMiddleware, post_blog_handler_1.createBlogHandler)
    .get("/:id", params_id_validation_middleware_1.idValidation, input_validtion_result_middleware_1.inputValidationResultMiddleware, get_blog_handler_1.getBlogHandler)
    .put('/:id', super_admin_guard_middleware_1.superAdminGuardMiddleware, params_id_validation_middleware_1.idValidation, blog_input_dto_validation_middlewares_1.blogInputDtoValidation, input_validtion_result_middleware_1.inputValidationResultMiddleware, put_blog_handler_1.updateBlogHandler)
    .delete('/:id', super_admin_guard_middleware_1.superAdminGuardMiddleware, params_id_validation_middleware_1.idValidation, blog_input_dto_validation_middlewares_1.blogInputDtoValidation, input_validtion_result_middleware_1.inputValidationResultMiddleware, delete_blog_handler_1.deleteBlogHandler);
