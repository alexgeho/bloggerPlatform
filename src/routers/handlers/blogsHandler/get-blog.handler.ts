import { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { blogsRepository } from "../../../blogs/repositories/blogs.repository";
import { HttpStatus } from "../../../core/types/http-statuses";
import { createErrorMessages } from "../../../core/utils/error.utils";
import { mapToBlogViewModel } from "../../../blogs/mappers/map-to-blog-view-model.util";

export async function getBlogHandler(req: Request, res: Response) {
    const id =req.params.id

    const blog = await blogsRepository.findById(id);

    if (!blog) {
        res.status(HttpStatus.NotFound).send(
            createErrorMessages([{ field: 'id', message: 'Blog not found' }])
        );
        return;
    }

    const blogViewModel = mapToBlogViewModel(blog);
    res.status(HttpStatus.Ok).send(blogViewModel);
}
