import {Router} from "express";
//import {putBlogHandler} from "./handlers/put-blog.handler";
//import {idValidation} from "../../core/middlewares/validation/params-id.validation-middleware";
import {inputValidationResultMiddleware} from "../../core/middlewares/validation/input-validtion-result.middleware";
//import {blogInputDtoValidation} from "../validation/blog.input-dto.validation-middlewares";
//import {deleteBlogHandler} from "./handlers/delete-blog.handler";
//import {superAdminGuardMiddleware} from "../../auth/middlewares/super-admin.guard-middleware";
//import {getBlogHandler} from "./handlers/get-blog.handler";
import {
    paginationAndSortingValidation
} from "../../core/middlewares/validation/query-pagination-sorting.validation-middleware";
//import {postPostHandler} from "./handlers/post-post.handler";
import {PostSortField} from "./input/post-sort-field";
import {getPostListHandler} from "./handlers/get-post-list.handler";


export const postsRouter = Router({});

postsRouter

    .get("/",
        paginationAndSortingValidation(PostSortField),
        inputValidationResultMiddleware,
        getPostListHandler)

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
