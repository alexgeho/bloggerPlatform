"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postsRouter = void 0;
const express_1 = require("express");
const input_validtion_result_middleware_1 = require("../../core/middlewares/validation/input-validtion-result.middleware");
const query_pagination_sorting_validation_middleware_1 = require("../../core/middlewares/validation/query-pagination-sorting.validation-middleware");
const post_post_handler_1 = require("./handlers/post-post.handler");
const post_sort_field_1 = require("./input/post-sort-field");
const get_post_list_handler_1 = require("./handlers/get-post-list.handler");
const super_admin_guard_middleware_1 = require("../../auth/middlewares/super-admin.guard-middleware");
const post_input_dto_validation_middlewares_1 = require("../validation/post.input-dto.validation-middlewares");
const params_id_validation_middleware_1 = require("../../core/middlewares/validation/params-id.validation-middleware");
const get_post_handler_1 = require("./handlers/get-post.handler");
const put_post_handler_1 = require("./handlers/put-post.handler");
const delete_post_handler_1 = require("./handlers/delete-post.handler");
exports.postsRouter = (0, express_1.Router)({});
exports.postsRouter
    .get("/", (0, query_pagination_sorting_validation_middleware_1.paginationAndSortingValidation)(post_sort_field_1.PostSortField), input_validtion_result_middleware_1.inputValidationResultMiddleware, get_post_list_handler_1.getPostListHandler)
    .post("/", super_admin_guard_middleware_1.superAdminGuardMiddleware, post_input_dto_validation_middlewares_1.postInputDtoValidation, input_validtion_result_middleware_1.inputValidationResultMiddleware, post_post_handler_1.postPostHandler)
    .get("/:id", params_id_validation_middleware_1.idValidation, input_validtion_result_middleware_1.inputValidationResultMiddleware, get_post_handler_1.getPostHandler)
    .put("/:id", super_admin_guard_middleware_1.superAdminGuardMiddleware, params_id_validation_middleware_1.idValidation, post_input_dto_validation_middlewares_1.postInputDtoValidation, input_validtion_result_middleware_1.inputValidationResultMiddleware, put_post_handler_1.putPostHandler)
    .delete('/:id', super_admin_guard_middleware_1.superAdminGuardMiddleware, params_id_validation_middleware_1.idValidation, delete_post_handler_1.deletePostHandler);
