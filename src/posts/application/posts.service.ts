import { postsRepository } from '../repositories/posts.repository';
import { ObjectId } from 'mongodb';
import { WithId } from 'mongodb';
import { Post } from '../domain/post';
import {PostQueryInput} from "../routers/input/post-query.input";
import { blogsRepository } from '../../blogs/repositories/blogs.repository';

//import { DomainError } from '../../core/errors/domain.error';
//import { BlogQueryInput } from '../routers/input/blog-query.input';
//import {BlogInputDto} from "./dtos/blog.input-dto";
//import {BlogDataOutput} from "../routers/output/blog-data.output";


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
}

//
//     async findByIdOrFail(id: string): Promise<WithId<Blog>> {
//         return postsRepository.findByIdOrFail(id);
//     },
//
//     async create(dto: BlogInputDto): Promise<BlogDataOutput> {
//         const newBlog: Blog = {
//             name: dto.name,
//             description: dto.description,
//             websiteUrl: dto.websiteUrl,
//             createdAt: new Date().toISOString(),
//             isMembership: true,
//         };
//         const id = await blogsRepository.create(newBlog);
//         return { id, ...newBlog };
//     },
//
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
// };
