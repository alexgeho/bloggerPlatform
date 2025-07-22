"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postsRouter = void 0;
var express_1 = require("express");
var input_validtion_result_middleware_1 = require("../../core/middlewares/validation/input-validtion-result.middleware");
var query_pagination_sorting_validation_middleware_1 = require("../../core/middlewares/validation/query-pagination-sorting.validation-middleware");
var post_post_handler_1 = require("./handlers/post-post.handler");
var post_sort_field_1 = require("./input/post-sort-field");
var get_post_list_handler_1 = require("./handlers/get-post-list.handler");
var super_admin_guard_middleware_1 = require("../../auth/middlewares/super-admin.guard-middleware");
var post_input_dto_validation_middlewares_1 = require("../validation/post.input-dto.validation-middlewares");
var params_id_validation_middleware_1 = require("../../core/middlewares/validation/params-id.validation-middleware");
var get_post_handler_1 = require("./handlers/get-post.handler");
var put_post_handler_1 = require("./handlers/put-post.handler");
var delete_post_handler_1 = require("./handlers/delete-post.handler");
exports.postsRouter = (0, express_1.Router)({});
exports.postsRouter
    .get("/", (0, query_pagination_sorting_validation_middleware_1.paginationAndSortingValidation)(post_sort_field_1.PostSortField), input_validtion_result_middleware_1.inputValidationResultMiddleware, get_post_list_handler_1.getPostListHandler)
    .post("/", super_admin_guard_middleware_1.superAdminGuardMiddleware, post_input_dto_validation_middlewares_1.postInputDtoValidation, input_validtion_result_middleware_1.inputValidationResultMiddleware, post_post_handler_1.postPostHandler)
    .get("/:id", params_id_validation_middleware_1.idValidation, input_validtion_result_middleware_1.inputValidationResultMiddleware, get_post_handler_1.getPostHandler)
    .put("/:id", super_admin_guard_middleware_1.superAdminGuardMiddleware, params_id_validation_middleware_1.idValidation, post_input_dto_validation_middlewares_1.postInputDtoValidation, input_validtion_result_middleware_1.inputValidationResultMiddleware, put_post_handler_1.putPostHandler)
    .delete('/:id', super_admin_guard_middleware_1.superAdminGuardMiddleware, params_id_validation_middleware_1.idValidation, delete_post_handler_1.deletePostHandler);
//# sourceMappingURL=posts.router.js.map