import { post } from '../types/post';
import { db } from '../../db/in-memory.db';
import { PostInputDto } from '../dto/post.input-dto';

export const postsRepository = {

    findAll(): post[] { return db.posts },

    findById(id: number): post | null {
         return db.posts.find((d) => d.id === id) ?? null; },

    create(newPost: post): post {
        db.posts.push(newPost);
        return newPost;
    },


    update(id: number, dto: PostInputDto): void {
        const post = db.posts.find((d) => d.id === id);

        if (!post) {
            throw new Error('Post not exist bitau');
        }

        post.title = dto.title;
        post.shortDescription = dto.shortDescription;
        post.content = dto.content;
    post.blogId = dto.blogId;

        return;
    },

    delete(id: number): void {
        const index = db.posts.findIndex((v) => v.id === id);

        if (index === -1) {
            throw new Error('post not exist Bitau');
        }

        db.posts.splice(index, 1);
        return;
    },


}