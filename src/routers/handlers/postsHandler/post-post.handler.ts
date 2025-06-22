import { Request, Response } from 'express';
import { PostInputDto } from '../../../posts/dto/post.input-dto';
import { HttpStatus } from '../../../core/types/http-statuses';
import { db } from '../../../db/in-memory.db';
import {postsRepository} from "../../../posts/repositories/posts.repository";
import {post} from "../../../posts/types/post";
import {blogsRepository} from "../../../blogs/repositories/blogs.repository";

export function createPostHandler(
    req: Request<{}, {}, PostInputDto>,
    res: Response
) {

    // 1. Найти блог по blogId из тела запроса
    const blog = blogsRepository.findById(+req.body.blogId);
    if (!blog) {
        return res.status(400).send({ errorMessages: [{ field: "blogId", message: "Blog not found" }] });
    }


    const newPost: post = {
        id: db.posts.length ? db.posts[db.posts.length - 1].id + 1 : 1,
        title: req.body.title,
        shortDescription: req.body.shortDescription,
        content: req.body.content,
        blogId: req.body.blogId,
        blogName: blog.name

    };

    postsRepository.create(newPost);

    res.status(HttpStatus.Created).send(newPost);

}