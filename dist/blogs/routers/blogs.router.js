"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogsRouter = void 0;
var express_1 = require("express");
var post_blog_handler_1 = require("./handlers/post-blog.handler");
var get_blog_list_handler_1 = require("./handlers/get-blog-list.handler");
var put_blog_handler_1 = require("./handlers/put-blog.handler");
var params_id_validation_middleware_1 = require("../../core/middlewares/validation/params-id.validation-middleware");
var input_validtion_result_middleware_1 = require("../../core/middlewares/validation/input-validtion-result.middleware");
var blog_input_dto_validation_middlewares_1 = require("../validation/blog.input-dto.validation-middlewares");
var delete_blog_handler_1 = require("./handlers/delete-blog.handler");
var super_admin_guard_middleware_1 = require("../../auth/middlewares/super-admin.guard-middleware");
var get_blog_handler_1 = require("./handlers/get-blog.handler");
var query_pagination_sorting_validation_middleware_1 = require("../../core/middlewares/validation/query-pagination-sorting.validation-middleware");
var blog_sort_field_1 = require("./input/blog-sort-field");
var get_blog_posts_handler_1 = require("./handlers/get-blog-posts.handler");
var express_async_handler_1 = require("../../core/utils/express-async-handler");
var post_blog_post_handler_1 = require("./handlers/post-blog-post.handler");
var blogId_validation_nested_1 = require("../../core/middlewares/validation/blogId-validation.nested");
var post_blogForPostInput_validation_middlewares_1 = require("../validation/post.blogForPostInput.validation-middlewares");
exports.blogsRouter = (0, express_1.Router)({});
console.log("=== TEST blogsRouter LOADED ===");
(_a = (_b = exports.blogsRouter
    .get("/", (0, query_pagination_sorting_validation_middleware_1.paginationAndSortingValidation)(blog_sort_field_1.BlogSortField), input_validtion_result_middleware_1.inputValidationResultMiddleware, get_blog_list_handler_1.getBlogListHandler)
    .post("/", 
//superAdminGuardMiddleware,
blog_input_dto_validation_middlewares_1.blogInputDtoValidation, input_validtion_result_middleware_1.inputValidationResultMiddleware, post_blog_handler_1.postBlogHandler)
    .get("/:id", params_id_validation_middleware_1.idValidation, input_validtion_result_middleware_1.inputValidationResultMiddleware, get_blog_handler_1.getBlogHandler)
    .put('/:id', super_admin_guard_middleware_1.superAdminGuardMiddleware, params_id_validation_middleware_1.idValidation, blog_input_dto_validation_middlewares_1.blogInputDtoValidation, input_validtion_result_middleware_1.inputValidationResultMiddleware, put_blog_handler_1.putBlogHandler)
    .delete('/:id', super_admin_guard_middleware_1.superAdminGuardMiddleware, delete_blog_handler_1.deleteBlogHandler))
    .get.apply(_b, __spreadArray(__spreadArray(['/:blogId/posts',
    input_validtion_result_middleware_1.inputValidationResultMiddleware], (0, blogId_validation_nested_1.blogIdValidationNested)('blogId'), false), [input_validtion_result_middleware_1.inputValidationResultMiddleware,
    (0, express_async_handler_1.asyncHandler)(get_blog_posts_handler_1.getBlogPostsHandler)], false)))
    .post.apply(_a, __spreadArray(__spreadArray(__spreadArray(__spreadArray(['/:blogId/posts',
    super_admin_guard_middleware_1.superAdminGuardMiddleware], post_blogForPostInput_validation_middlewares_1.postInputDtoForBlogValidation, false), [// <<<<< только три поля из body!
    input_validtion_result_middleware_1.inputValidationResultMiddleware], false), (0, blogId_validation_nested_1.blogIdValidationNested)('blogId'), false), [// <<<<< отдельно валидируй path param
    post_blog_post_handler_1.postBlogPostHandler], false));
// idValidation, // или blogIdValidation
//postInputDtoValidation,
// inputValidationResultMiddleware,
//# sourceMappingURL=blogs.router.js.map