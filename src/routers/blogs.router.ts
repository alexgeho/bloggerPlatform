import {Request, Response, Router} from "express";
import {BlogInputDto} from "../blogs/dto/blog.input-dto";
import {blogInputDtoValidation} from "../blogs/validation/blogInputDtoValidation";
import {blog, BlogViewModel} from "../blogs/types/blog";
import {HttpStatus} from "../core/types/http-statuses";
import {createErrorMessages} from "../core/utils/error.utils";
import {db} from "../db/in-memory.db"
import {getBlogListHandler} from "./handlers/get-blog-list.handler";
import {createBlogHandler} from "./handlers/post-blog.handler";
import {getBlogHandler} from "./handlers/get-blog.handler";
import {updateBlogHandler} from "./handlers/update-driver.handler";


export const blogsRouter = Router({});

blogsRouter

    .get("/", getBlogListHandler)

    .post("/", createBlogHandler)

    .get("/:id", getBlogHandler)

    .put('/:id', updateBlogHandler)