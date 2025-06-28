import {Router} from "express";
import {createBlogHandler} from "./handlers/blogsHandler/post-blog.handler";
import {getBlogListHandler} from "./handlers/blogsHandler/get-blog-list.handler";
import {putBlogHandler} from "./handlers/blogsHandler/put-blog.handler";
import {idValidation} from "../core/middlewares/validation/params-id.validation-middleware";
import {inputValidationResultMiddleware} from "../core/middlewares/validation/input-validtion-result.middleware";
import {blogInputDtoValidation} from "../blogs/validation/blog.input-dto.validation-middlewares";
import {deleteBlogHandler} from "./handlers/blogsHandler/delete-blog.handler";
import {superAdminGuardMiddleware} from "../auth/middlewares/super-admin.guard-middleware";
import {getBlogHandler} from "./handlers/blogsHandler/get-blog.handler";


export const blogsRouter = Router({});

blogsRouter

    .get("/",
        getBlogListHandler)

    .post("/",
        superAdminGuardMiddleware,
        blogInputDtoValidation,
        inputValidationResultMiddleware,
        createBlogHandler)

    .get("/:id",
        idValidation,
        inputValidationResultMiddleware,
        getBlogHandler)

    .put('/:id',
        superAdminGuardMiddleware,
        idValidation,
        blogInputDtoValidation,
        inputValidationResultMiddleware,
        putBlogHandler)

    .delete('/:id',
        superAdminGuardMiddleware,
        deleteBlogHandler
    )


