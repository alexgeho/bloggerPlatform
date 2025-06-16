import {Request, Response, Router} from "express";
import {BlogInputDto} from "../blogs/dto/blog.input-dto";
import {blogInputDtoValidation} from "../blogs/validation/blogInputDtoValidation";
import {blog, BlogViewModel} from "../blogs/types/blog";
import {HttpStatus} from "../core/types/http-statuses";
import {createErrorMessages} from "../core/utils/error.utils";
import {db} from "../db/in-memory.db"


export const testingRouter = Router({});

testingRouter

.delete('/testing/all-data', (req, res) => {
    console.log('DELETE /testing/all-data called');
    db.blogs.length = 0; // очищаем все блоги
    res.sendStatus(HttpStatus.NoContent); // 204
});
