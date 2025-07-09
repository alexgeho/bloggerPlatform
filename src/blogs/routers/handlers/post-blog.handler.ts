import { Request, Response } from 'express';
import { BlogInputDto } from '../../dto/blog.input-dto';
import { HttpStatus } from '../../../core/types/http-statuses';
import {blogsRepository} from "../../repositories/blogs.repository";
import {mapToBlogViewModel} from "../mappers/map-to-blog-output.util";

export async function createBlogHandler(
    req: Request<{}, {}, BlogInputDto>,
    res: Response) {

    try {
        const newBlog: BlogInputDto = {
            name: req.body.name,
            description: req.body.description,
            websiteUrl: req.body.websiteUrl,
            createdAt: new Date().toISOString(), // ✅ ISO-строка
            isMembership: false
        };

const createdBlog = await blogsRepository.create(newBlog);
const blogViewModel = mapToBlogViewModel(createdBlog);
res.status(HttpStatus.Created).send(blogViewModel); }

    catch (e: unknown) {
    res.sendStatus(HttpStatus.InternalServerError);
    }
}
