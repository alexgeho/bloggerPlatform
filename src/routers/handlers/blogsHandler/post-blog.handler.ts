import { Request, Response } from 'express';
import { BlogInputDto } from '../../../blogs/dto/blog.input-dto';
import { HttpStatus } from '../../../core/types/http-statuses';
import {blogsRepository} from "../../../blogs/repositories/blogs.repository";
import {mapToBlogViewModel} from "../../../blogs/mappers/map-to-blog-view-model.util";

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
