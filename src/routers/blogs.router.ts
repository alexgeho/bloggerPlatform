import {Router} from "express";
import {getBlogListHandler} from "./handlers/blogsHandler/get-blog-list.handler";
import {createBlogHandler} from "./handlers/blogsHandler/post-blog.handler";
import {getBlogHandler} from "./handlers/blogsHandler/get-blog.handler";
import {updateBlogHandler} from "./handlers/blogsHandler/update-driver.handler";
import {idValidation} from "../core/middlewares/validation/params-id.validation-middleware";
import {inputValidationResultMiddleware} from "../core/middlewares/validation/input-validtion-result.middleware";
import {blogInputDtoValidation} from "../blogs/validation/blog.input-dto.validation-middlewares";
import {deleteBlogHandler} from "./handlers/blogsHandler/delete-blog.handler";
import {superAdminGuardMiddleware} from "../auth/middlewares/super-admin.guard-middleware";
import {deleteAllBlogHandler} from "./handlers/testingHandler/delete-all-blogs.handler";


export const blogsRouter = Router({});

blogsRouter

    .get("/", getBlogListHandler)

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
        updateBlogHandler)

    .delete('/:id',
        superAdminGuardMiddleware,
        idValidation,
        blogInputDtoValidation,
        inputValidationResultMiddleware,
        deleteBlogHandler
    )


