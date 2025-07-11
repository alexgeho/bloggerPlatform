"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postsRouter = void 0;
const express_1 = require("express");
//import {putBlogHandler} from "./handlers/put-blog.handler";
//import {idValidation} from "../../core/middlewares/validation/params-id.validation-middleware";
const input_validtion_result_middleware_1 = require("../../core/middlewares/validation/input-validtion-result.middleware");
//import {blogInputDtoValidation} from "../validation/blog.input-dto.validation-middlewares";
//import {deleteBlogHandler} from "./handlers/delete-blog.handler";
//import {superAdminGuardMiddleware} from "../../auth/middlewares/super-admin.guard-middleware";
//import {getBlogHandler} from "./handlers/get-blog.handler";
const query_pagination_sorting_validation_middleware_1 = require("../../core/middlewares/validation/query-pagination-sorting.validation-middleware");
//import {postPostHandler} from "./handlers/post-post.handler";
const post_sort_field_1 = require("./input/post-sort-field");
const get_post_list_handler_1 = require("./handlers/get-post-list.handler");
exports.postsRouter = (0, express_1.Router)({});
exports.postsRouter
    .get("/", (0, query_pagination_sorting_validation_middleware_1.paginationAndSortingValidation)(post_sort_field_1.PostSortField), input_validtion_result_middleware_1.inputValidationResultMiddleware, get_post_list_handler_1.getPostListHandler);
// .post("/",
//     superAdminGuardMiddleware,
//     blogInputDtoValidation,
//     inputValidationResultMiddleware,
//     postPostHandler)
// .get("/:id",
//     idValidation,
//     inputValidationResultMiddleware,
//     getBlogHandler)
//
// .put('/:id',
//     superAdminGuardMiddleware,
//     idValidation,
//     blogInputDtoValidation,
//     inputValidationResultMiddleware,
//     putBlogHandler)
//
// .delete('/:id',
//     superAdminGuardMiddleware,
//     deleteBlogHandler
// )
//
//
