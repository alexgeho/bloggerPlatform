import {Router} from "express";
import {postBlogHandler} from "./handlers/post-blog.handler";
import {getBlogListHandler} from "./handlers/get-blog-list.handler";
import {inputValidationResultMiddleware} from "../../core/middlewares/validation/input-validtion-result.middleware";
import {deleteBlogHandler} from "./handlers/delete-blog.handler";
import {superAdminGuardMiddleware} from "../../auth/middlewares/super-admin.guard-middleware";
import {
    paginationAndSortingValidation
} from "../../core/middlewares/validation/query-pagination-sorting.validation-middleware";
import {UserSortField} from "./input/user-sort-field";


export const userRouter = Router({});
console.log("=== TEST blogsRouter LOADED ===");
userRouter

    .get("/",
        paginationAndSortingValidation(UserSortField),
        inputValidationResultMiddleware,
        getBlogListHandler)

    .post("/",
       //  superAdminGuardMiddleware,
       //  blogInputDtoValidation,
       // inputValidationResultMiddleware,
        postBlogHandler)

    .delete('/:id',
        superAdminGuardMiddleware,
        deleteBlogHandler)


