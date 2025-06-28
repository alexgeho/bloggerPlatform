import {Router} from "express";
import {getPostListHandler} from "./handlers/postsHandler/get-post-list.handler";
import {getPostHandler} from "./handlers/postsHandler/get-post.handler";
import {idValidation} from "../core/middlewares/validation/params-id.validation-middleware";
import {inputValidationResultMiddleware} from "../core/middlewares/validation/input-validtion-result.middleware";
import {createPostHandler} from "./handlers/postsHandler/post-post.handler";
import {superAdminGuardMiddleware} from "../auth/middlewares/super-admin.guard-middleware";
import {postInputDtoValidation} from "../posts/validation/post.input-dto.validation-middlewares";
import {putPostHandler} from "./handlers/postsHandler/put-post.handler";
import {deletePostHandler} from "./handlers/postsHandler/delete-post.handler";


export const postsRouter = Router({});

postsRouter

    .get("/", getPostListHandler)

    .post("/",
        superAdminGuardMiddleware,
        postInputDtoValidation,
        inputValidationResultMiddleware,
        createPostHandler)

    .get("/:id",
        idValidation,
        inputValidationResultMiddleware,
        getPostHandler)

    .put('/:id',
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


