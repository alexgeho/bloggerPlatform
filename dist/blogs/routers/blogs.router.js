"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogsRouter = void 0;
const express_1 = require("express");
const post_blog_handler_1 = require("./handlers/post-blog.handler");
const get_blog_list_handler_1 = require("./handlers/get-blog-list.handler");
const put_blog_handler_1 = require("./handlers/put-blog.handler");
const params_id_validation_middleware_1 = require("../../core/middlewares/validation/params-id.validation-middleware");
const input_validtion_result_middleware_1 = require("../../core/middlewares/validation/input-validtion-result.middleware");
const blog_input_dto_validation_middlewares_1 = require("../validation/blog.input-dto.validation-middlewares");
const delete_blog_handler_1 = require("./handlers/delete-blog.handler");
const super_admin_guard_middleware_1 = require("../../auth/middlewares/super-admin.guard-middleware");
const get_blog_handler_1 = require("./handlers/get-blog.handler");
const query_pagination_sorting_validation_middleware_1 = require("../../core/middlewares/validation/query-pagination-sorting.validation-middleware");
const blog_sort_field_1 = require("./input/blog-sort-field");
const get_blog_posts_handler_1 = require("./handlers/get-blog-posts.handler");
const express_async_handler_1 = require("../../core/utils/express-async-handler");
exports.blogsRouter = (0, express_1.Router)();
exports.blogsRouter
    .get("/", (0, query_pagination_sorting_validation_middleware_1.paginationAndSortingValidation)(blog_sort_field_1.BlogSortField), input_validtion_result_middleware_1.inputValidationResultMiddleware, get_blog_list_handler_1.getBlogListHandler)
    .post("/", super_admin_guard_middleware_1.superAdminGuardMiddleware, blog_input_dto_validation_middlewares_1.blogInputDtoValidation, input_validtion_result_middleware_1.inputValidationResultMiddleware, post_blog_handler_1.postBlogHandler)
    .get("/:id", params_id_validation_middleware_1.idValidation, input_validtion_result_middleware_1.inputValidationResultMiddleware, get_blog_handler_1.getBlogHandler)
    .put('/:id', super_admin_guard_middleware_1.superAdminGuardMiddleware, params_id_validation_middleware_1.idValidation, blog_input_dto_validation_middlewares_1.blogInputDtoValidation, input_validtion_result_middleware_1.inputValidationResultMiddleware, put_blog_handler_1.putBlogHandler)
    .delete('/:id', super_admin_guard_middleware_1.superAdminGuardMiddleware, delete_blog_handler_1.deleteBlogHandler)
    .get('/:blogId/posts', input_validtion_result_middleware_1.inputValidationResultMiddleware, (0, express_async_handler_1.asyncHandler)(get_blog_posts_handler_1.getBlogPostsHandler));
// .post('/:blogId/posts',
//     superAdminGuardMiddleware,
//     postInputDtoValidation,
//     inputValidationResultMiddleware,
//     postBlogPostHandler)
