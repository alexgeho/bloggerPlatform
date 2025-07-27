import {postsRepository} from '../repositories/posts.repository';
import {blogsRepository} from '../../blogs/repositories/blogs.repository';
import {CommentDataOutput} from "../routers/output/comment-data.output";
import {CommentInputDto} from "./dtos/comment.input-dto";
import {commentsRepository} from "../repositories/comments.repository";

export const commentsService = {

    async create(
        postId: string,
        dto: CommentInputDto,
        user: { userId: string; userLogin: string}

        ): Promise<CommentDataOutput> {


        const commentNew = {
            content: dto.content
        };

        const createdId = await commentsRepository.create(commentNew); // string (id)
        const createdComment = await postsRepository.findByIdOrFail(createdId); // возвращает PostDb | null

        if (!commentNew) throw new Error('Post not found after creation');

        return {
            id: commentNew._id.toString(),
            content: commentNew.content,
            commentatorInfo: {
                "userId": "string",
                "userLogin": "string"
            }
            createdAt: commentNew.createdAt,
        };}

    // async findMany(queryDto: PostQueryInput): Promise<{ items: any[]; totalCount: number }> {
    //     return postsRepository.findMany(queryDto);
    //
    //     // const blogIds = [...new Set(items.map(post => post.blogId))];
    //     // const blogs = await blogsRepository.findByIds(blogIds);
    //     // if (!blogs || blogs.length === 0) throw new Error('Blog not found');
    //     //
    //     // const blogsMap: { [k: string]: any } = Object.fromEntries(
    //     //     blogs.map((bLog: any) => [bLog._id.toString(), bLog.name])
    //     // );
    //     //
    //     // const enrichedPosts = items.map(post => ({
    //     //     ...post,
    //     //     blogName: blogsMap[post.blogId] || null,
    //     // }));
    //     //
    //     // return { items: enrichedPosts, totalCount };
    // },

    // async findAllByBlogId(
    //     blogId: string, pageNumber: number, pageSize: number, sortBy: string, sortDirection: 'asc' | 'desc'
    // ) {
    //     // 1. Репозиторий возвращает массив постов и totalCount
    //     return await postsRepository.findByBlogIdWithPagination(
    //         blogId, pageNumber, pageSize, sortBy, sortDirection
    //     );
    // },

    // async findByIdOrFail(id: string): Promise<WithId<PostDb>> {
    //     const post = await postsRepository.findByIdOrFail(id);
    //     if (!post) {
    //         throw new RepositoryNotFoundError('Post not exist'); // ← вернёт 404!
    //     }
    //     return post; // тут post точно не null, TS доволен
    // },


    // async update(id: string, dto: PostInputDto): Promise<void> {
    //     console.log('SERVICE UPDATE — до repo.update', id, dto); // Лог до
    // await postsRepository.update(id, dto);
    //     console.log('SERVICE UPDATE — после repo.update'); // Лог после
    //     return;},
    //

//     async delete(id: string): Promise<void> {
//
//         await postsRepository.delete(id);
//         return;
//     },
};
