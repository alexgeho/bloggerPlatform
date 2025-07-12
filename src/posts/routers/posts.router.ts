import {Router} from "express";
import {inputValidationResultMiddleware} from "../../core/middlewares/validation/input-validtion-result.middleware";
import {
    paginationAndSortingValidation
} from "../../core/middlewares/validation/query-pagination-sorting.validation-middleware";
import {postPostHandler} from "./handlers/post-post.handler";
import {PostSortField} from "./input/post-sort-field";
import {getPostListHandler} from "./handlers/get-post-list.handler";
import {superAdminGuardMiddleware} from "../../auth/middlewares/super-admin.guard-middleware";
import {postInputDtoValidation} from "../validation/post.input-dto.validation-middlewares";
import {idValidation} from "../../core/middlewares/validation/params-id.validation-middleware";
import {getPostHandler} from "./handlers/get-post.handler";
import {putPostHandler} from "./handlers/put-post.handler";
import {deletePostHandler} from "./handlers/delete-post.handler";


export const postsRouter = Router({});

postsRouter

    .get("/",
        paginationAndSortingValidation(PostSortField),
        inputValidationResultMiddleware,
        getPostListHandler)

    .post("/",
        superAdminGuardMiddleware,
        postInputDtoValidation,
        inputValidationResultMiddleware,
        postPostHandler)

    .get("/:id",
        idValidation,
        inputValidationResultMiddleware,
        getPostHandler)

    .put("/:id",
        superAdminGuardMiddleware,
        idValidation,
        postInputDtoValidation,
        inputValidationResultMiddleware,
        putPostHandler)

    .delete('/:id',
        superAdminGuardMiddleware,
        idValidation,
        deletePostHandler
    )


