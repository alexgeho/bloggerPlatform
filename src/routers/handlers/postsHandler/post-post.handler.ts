import { Request, Response } from 'express';
import { PostInputDto } from '../../../posts/dto/post.input-dto';
import { HttpStatus } from '../../../core/types/http-statuses';
import { postsRepository } from '../../../posts/repositories/posts.repository';
import { Post } from '../../../posts/types/post';
import { mapToPostViewModel } from '../../../posts/mappers/map-to-post-view-model.util';

export async function createPostHandler(
    req: Request<{}, {}, PostInputDto>,
    res: Response,
) {
    try {
        const newPost: Post = {
            title: req.body.title,
            shortDescription: req.body.shortDescription,
            content: req.body.content,
            blogId: req.body.blogId,
            blogName: "TemporaryBlogName",
            createdAt: new Date().toISOString(),
        };

        const createdPost = await postsRepository.create(newPost);
        const postViewModel = mapToPostViewModel(createdPost);
        res.status(HttpStatus.Created).send(postViewModel);
    } catch (e: unknown) {
        res.sendStatus(HttpStatus.InternalServerError);
    }
}
