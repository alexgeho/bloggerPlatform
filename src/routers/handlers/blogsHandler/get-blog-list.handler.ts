import {Request, Response} from 'express';
import {HttpStatus} from '../../../core/types/http-statuses';
import {blogsRepository} from "../../../blogs/repositories/blogs.repository";
import {mapToBlogViewModel} from "../../../blogs/mappers/map-to-blog-view-model.util";

export async function getBlogListHandler(req: Request, res: Response) {
    try {
        const blogs = await blogsRepository.findAll();
        const blogViewModels= blogs.map(mapToBlogViewModel);
        res.send(blogViewModels);
    } catch (e:unknown) {
        res.sendStatus(HttpStatus.InternalServerError);
    }
}
