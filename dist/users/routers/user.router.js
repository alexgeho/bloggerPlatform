"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const express_1 = require("express");
const post_blog_handler_1 = require("./handlers/post-blog.handler");
const get_blog_list_handler_1 = require("./handlers/get-blog-list.handler");
const input_validtion_result_middleware_1 = require("../../core/middlewares/validation/input-validtion-result.middleware");
const delete_blog_handler_1 = require("./handlers/delete-blog.handler");
const super_admin_guard_middleware_1 = require("../../auth/middlewares/super-admin.guard-middleware");
const query_pagination_sorting_validation_middleware_1 = require("../../core/middlewares/validation/query-pagination-sorting.validation-middleware");
const user_sort_field_1 = require("./input/user-sort-field");
exports.userRouter = (0, express_1.Router)({});
console.log("=== TEST blogsRouter LOADED ===");
exports.userRouter
    .get("/", (0, query_pagination_sorting_validation_middleware_1.paginationAndSortingValidation)(user_sort_field_1.UserSortField), input_validtion_result_middleware_1.inputValidationResultMiddleware, get_blog_list_handler_1.getBlogListHandler)
    .post("/", 
//  superAdminGuardMiddleware,
//  blogInputDtoValidation,
// inputValidationResultMiddleware,
post_blog_handler_1.postBlogHandler)
    .delete('/:id', super_admin_guard_middleware_1.superAdminGuardMiddleware, delete_blog_handler_1.deleteBlogHandler);
