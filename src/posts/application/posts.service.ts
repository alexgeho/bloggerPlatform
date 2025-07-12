import { postsRepository } from '../repositories/posts.repository';
import {PostQueryInput} from "../routers/input/post-query.input";
import { blogsRepository } from '../../blogs/repositories/blogs.repository';
import {PostInputDto} from "./dtos/post.input-dto";
import {PostDataOutput} from "../routers/output/post-data.output";

export const postsService = {

    async findMany(queryDto: PostQueryInput): Promise<{ items: any[]; totalCount: number }> {
        const { items, totalCount } = await postsRepository.findMany(queryDto);

        const blogIds = [...new Set(items.map(post => post.blogId))];
        const blogs = await blogsRepository.findByIds(blogIds);
        const blogsMap: { [k: string]: any } = Object.fromEntries(
            blogs.map((bLog: any) => [bLog._id.toString(), bLog.name])
        );

        const enrichedPosts = items.map(post => ({
            ...post,
            blogName: blogsMap[post.blogId] || null,
        }));

        return { items: enrichedPosts, totalCount };
    },

    async findAllByBlogId(
        blogId: string,
        pageNumber: number,
        pageSize: number,
        sortBy: string,
        sortDirection: 'asc' | 'desc'
    ) {
        // 1. Репозиторий возвращает массив постов и totalCount
        return await postsRepository.findByBlogIdWithPagination(
            blogId, pageNumber, pageSize, sortBy, sortDirection
        );
    },

//
//     async findByIdOrFail(id: string): Promise<WithId<Blog>> {
//         return postsRepository.findByIdOrFail(id);
//     },
//

    // src/posts/application/posts.service.ts

    async create(dto: PostInputDto): Promise<PostDataOutput> {
        const blog = await blogsRepository.findById(dto.blogId);
        if (!blog) throw new Error('Blog not found');

        const newPost = {
            title: dto.title,
            shortDescription: dto.shortDescription,
            content: dto.content,
            blogId: dto.blogId,
            blogName: blog.name,
            createdAt: new Date().toISOString(),
        };

        const createdId = await postsRepository.create(newPost); // string (id)
        const createdPost = await postsRepository.findById(createdId); // возвращает PostDb | null

        if (!createdPost) throw new Error('Post not found after creation');

        return {
            id: createdPost.id ? createdPost.id.toString() : createdPost.id,
            title: createdPost.title,
            shortDescription: createdPost.shortDescription,
            content: createdPost.content,
            blogId: createdPost.blogId,
            blogName: createdPost.blogName,
            createdAt: createdPost.createdAt,
        };
    }



    // ...


//
//     async update(id: string, dto: BlogInputDto): Promise<void> {
//         await blogsRepository.update(id, dto);
//         return;
//     },
//
//     async delete(id: string): Promise<void> {
//
//         await blogsRepository.delete(id);
//         return;
//     },
};
