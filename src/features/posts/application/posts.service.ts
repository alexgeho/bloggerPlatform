import { postsRepository } from '../repositories/posts.repository';
import {PostQueryInput} from "../routers/input/post-query.input";
import { blogsRepository } from '../../blogs/repositories/blogs.repository';
import {PostInputDto} from "./dtos/post.input-dto";
import {PostDataOutput} from "../routers/output/post-data.output";
import {PostDb} from "../domain/postDb";
import {WithId} from "mongodb";
import {RepositoryNotFoundError} from "../../../core/errors/repository-not-found.error";

export const postsService = {

    async findMany(queryDto: PostQueryInput): Promise<{ items: any[]; totalCount: number }> {
        return postsRepository.findMany(queryDto);

        // const blogIds = [...new Set(items.map(post => post.blogId))];
        // const blogs = await blogsRepository.findByIds(blogIds);
        // if (!blogs || blogs.length === 0) throw new Error('Blog not found');
        //
        // const blogsMap: { [k: string]: any } = Object.fromEntries(
        //     blogs.map((bLog: any) => [bLog._id.toString(), bLog.name])
        // );
        //
        // const enrichedPosts = items.map(post => ({
        //     ...post,
        //     blogName: blogsMap[post.blogId] || null,
        // }));
        //
        // return { items: enrichedPosts, totalCount };
    },

    async findAllByBlogId(
        blogId: string, pageNumber: number, pageSize: number, sortBy: string, sortDirection: 'asc' | 'desc'
    ) {
        // 1. Репозиторий возвращает массив постов и totalCount
        return await postsRepository.findByBlogIdWithPagination(
            blogId, pageNumber, pageSize, sortBy, sortDirection
        );
    },

    async findByIdOrFail(id: string): Promise<WithId<PostDb>> {
        const post = await postsRepository.findByIdOrFail(id);
        if (!post) {
            throw new RepositoryNotFoundError('Post not exist'); // ← вернёт 404!
        }
        return post; // тут post точно не null, TS доволен
    },

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
        const createdPost = await postsRepository.findByIdOrFail(createdId); // возвращает PostDb | null

        if (!createdPost) throw new Error('Post not found after creation');

        return {
            id: createdPost._id.toString(),
            title: createdPost.title,
            shortDescription: createdPost.shortDescription,
            content: createdPost.content,
            blogId: createdPost.blogId,
            blogName: createdPost.blogName,
            createdAt: createdPost.createdAt,
        };},

    async update(id: string, dto: PostInputDto): Promise<void> {
    await postsRepository.update(id, dto);
        return;},


    async delete(id: string): Promise<void> {

        await postsRepository.delete(id);
        return;
    },
};
