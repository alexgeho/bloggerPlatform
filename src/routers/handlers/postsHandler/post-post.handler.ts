import { Request, Response } from 'express';
import { PostInputDto } from '../../../posts/dto/post.input-dto';
import { HttpStatus } from '../../../core/types/http-statuses';
import { postsRepository } from '../../../posts/repositories/posts.repository';
import { Post } from '../../../posts/types/post';
import { mapToPostViewModel } from '../../../posts/mappers/map-to-post-view-model.util';
import {blogsRepository} from "../../../blogs/repositories/blogs.repository";

export async function createPostHandler(req: Request<{}, {}, PostInputDto>, res: Response) {
    try {
        const blogId = req.body.blogId;

        // Проверяем, существует ли блог
        const blog = await blogsRepository.findById(blogId);
        if (!blog) {
            res.sendStatus(HttpStatus.NotFound); // 404 если блог не найден
            return;
        }

        const newPost: Post = {
            title: req.body.title,
            shortDescription: req.body.shortDescription,
            content: req.body.content,
            blogId: blog._id.toString(),
            blogName: blog.name, // используем настоящее имя блога
            createdAt: new Date().toISOString(),
        };

        const createdPost = await postsRepository.create(newPost);
        const postViewModel = mapToPostViewModel(createdPost);

        res.status(HttpStatus.Created).send(postViewModel); // 201 Created
    } catch (e: unknown) {
        res.sendStatus(HttpStatus.InternalServerError); // 500
    }
}
