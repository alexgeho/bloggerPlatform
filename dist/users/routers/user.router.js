"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersRouter = void 0;
var express_1 = require("express");
var post_user_handler_1 = require("./handlers/post-user.handler");
var get_user_list_handler_1 = require("./handlers/get-user-list.handler");
var input_validtion_result_middleware_1 = require("../../core/middlewares/validation/input-validtion-result.middleware");
var delete_user_handler_1 = require("./handlers/delete-user.handler");
var super_admin_guard_middleware_1 = require("../../auth/middlewares/super-admin.guard-middleware");
var query_pagination_sorting_validation_middleware_1 = require("../../core/middlewares/validation/query-pagination-sorting.validation-middleware");
var user_sort_field_1 = require("./input/user-sort-field");
var user_input_dto_validation_middlewares_1 = require("../validation/user.input-dto.validation-middlewares");
exports.usersRouter = (0, express_1.Router)({});
console.log("=== TEST blogsRouter LOADED ===");
exports.usersRouter
    .get("/", (0, query_pagination_sorting_validation_middleware_1.paginationAndSortingValidation)(user_sort_field_1.UserSortField), input_validtion_result_middleware_1.inputValidationResultMiddleware, get_user_list_handler_1.getUserListHandler)
    .post("/", super_admin_guard_middleware_1.superAdminGuardMiddleware, user_input_dto_validation_middlewares_1.UserInputDtoValidation, input_validtion_result_middleware_1.inputValidationResultMiddleware, post_user_handler_1.postUserHandler)
    .delete('/:id', super_admin_guard_middleware_1.superAdminGuardMiddleware, delete_user_handler_1.deleteUserHandler);
//# sourceMappingURL=user.router.js.map