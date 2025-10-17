import {postsRepository} from '../repositories/posts.repository';
import {PostQueryInput} from "../routers/input/post-query.input";
import {blogsRepository} from '../../blogs/repositories/blogs.repository';
import {PostInputDto} from "./dtos/post.input-dto";
import {PostDataOutput} from "../routers/output/post-data.output";
import {PostDb} from "../domain/postDb";
import {WithId} from "mongodb";
import {RepositoryNotFoundError} from "../../../core/errors/repository-not-found.error";
import {likesService} from "../../likes/likes.serviceAndRep";
import {mapToPostOutput} from "../routers/mappers/map-to-post-output.util";

export const postsService = {

    async updateLikeOnPost(postId: string, userId: string, likeStatus: string) {

        const existingPost = await postsRepository.findByIdOrFail(postId);
        if (!existingPost) {

            throw new RepositoryNotFoundError("Post not found");
        }


        await likesService.createLikeOnPost(postId, userId, likeStatus);

    },

    async findMany(queryDto: PostQueryInput, userId?: string) {
        const { items, totalCount } = await postsRepository.findMany(queryDto);

        const postsWithLikes = await Promise.all(
            items.map(async (post) => {
                // 👇 теперь likesService может вернуть корректный myStatus
                const likesExtended = await likesService.findAllLikesOnPost(post._id.toString(), userId);
                return mapToPostOutput(post, likesExtended);
            })
        );

        return { items: postsWithLikes, totalCount };
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
            extendedLikesInfo: {
                likesCount: 0,
                dislikesCount: 0,
                myStatus: 'None',
                newestLikes: []
            }
        };
    },

    async update(id: string, dto: PostInputDto): Promise<void> {
        await postsRepository.update(id, dto);
        return;
    },


    async delete(id: string): Promise<void> {

        await postsRepository.delete(id);
        return;
    },
};
