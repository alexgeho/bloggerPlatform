import { Request, Response } from 'express';
import { BlogInputDto } from '../../../blogs/dto/blog.input-dto';
import { HttpStatus } from '../../../core/types/http-statuses';
import { createErrorMessages } from '../../../core/utils/error.utils';
import { db } from '../../../db/in-memory.db';
import { blog } from '../../../blogs/types/blog';
import {blogInputDtoValidation} from "../../../blogs/validation/blogInputDtoValidation";
import {blogsRepository} from "../../../blogs/repositories/blogs.repository";

export function createBlogHandler(
    req: Request<{}, {}, BlogInputDto>,
    res: Response) {
    const errors = blogInputDtoValidation(req.body);
    if (errors.length > 0) {
        res.status(HttpStatus.BadRequest).send(createErrorMessages(errors));
    }
    //1) проверяем приходящие данные на валидность
    //2) создаем newBlog
    const newBlog: blog = {
        id: db.blogs.length ? db.blogs[db.blogs.length - 1].id + 1 : 1,
        name: req.body.name,
        description: req.body.description,
        websiteUrl: req.body.websiteUrl
    };


    blogsRepository.create(newBlog);
    res.status(HttpStatus.Created).send(newBlog);
    
}