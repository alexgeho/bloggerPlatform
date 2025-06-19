import { Router} from "express";
import {getBlogListHandler} from "./handlers/get-blog-list.handler";
import {createBlogHandler} from "./handlers/post-blog.handler";
import {getBlogHandler} from "./handlers/get-blog.handler";
import {updateBlogHandler} from "./handlers/update-driver.handler";
import {idValidation} from "../core/middlewares/validation/params-id.validation-middleware";
import {inputValidationResultMiddleware} from "../core/middlewares/validation/input-validtion-result.middleware";
import {blogInputDtoValidation} from "../blogs/validation/blog.input-dto.validation-middlewares";
import {deleteBlogHandler} from "./handlers/delete-blog.handler";



export const blogsRouter = Router({});

blogsRouter

    .get("/", getBlogListHandler)

    .post("/",
        blogInputDtoValidation,
        inputValidationResultMiddleware,
        createBlogHandler)

    .get("/:id",
        idValidation,
        inputValidationResultMiddleware,
        getBlogHandler)

    .put('/:id',
        idValidation,
        blogInputDtoValidation,
        inputValidationResultMiddleware,
        updateBlogHandler)

.delete('/testing/all-data',
    idValidation,
    blogInputDtoValidation,
    inputValidationResultMiddleware,
    deleteBlogHandler
    )