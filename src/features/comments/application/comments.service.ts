import { postsRepository } from '../../posts/repositories/posts.repository';
import { commentsRepository } from '../repositories/comments.repository';
import { CommentDataOutput } from '../routers/output/comment-data.output';
import { CommentInputDto } from './dtos/comment.input-dto';
import { ObjectId } from 'mongodb';
import { CommentDb } from '../domain/commentDb';
import { CommentQueryInput } from '../routers/input/comment-query.input';
import { mapToCommentListPaginatedOutput } from '../routers/mappers/map-to-comment-list-paginated-output.util';
import { Result } from "../../auth/common/result/result.type";
import {ResultStatus} from "../../auth/common/result/resultCode";
import {userRepository} from "../../../composition-root";

export const commentsService = {

    async setLikeStatus(commentId: string, userId: string, likeStatus: "None" | "Like" | "Dislike") {
        const updated = await commentsRepository.updateLikeStatus(commentId, userId, likeStatus);
        if (!updated) throw new Error("Comment not found");
        return;
    },

    async create(postId: string, dto: CommentInputDto, user: { userId: string}): Promise<CommentDataOutput> {

        const post = await postsRepository.findByIdOrFail(postId);

        if (!post) throw new Error('Post not found');

        const userById= await userRepository.findById(user.userId);

        if (!userById) throw new Error('User not found');

        // todo userLogin должен предаться в 41                 userLogin: user.userLogin,
        const login = userById.accountData.login;
        console.log('login:', login);
        console.log('post:', post);
        console.log('user:', user);

        const commentToSave: CommentDb = {
            _id: new ObjectId(),
            content: dto.content,
            commentatorInfo: {
                userId: user.userId,
                userLogin: userById.accountData.login,
            },
            createdAt: new Date().toISOString(),
        };

        const savedCommentId = await commentsRepository.create(commentToSave);

        return {
            id: savedCommentId,
            content: commentToSave.content,
            commentatorInfo: commentToSave.commentatorInfo,
            createdAt: commentToSave.createdAt,
        };
    },

    async findManyByPostId(postId: string, queryDto: CommentQueryInput): Promise<ReturnType<typeof mapToCommentListPaginatedOutput>> {
        const {
            pageNumber,
            pageSize,
            sortBy = 'createdAt',
            sortDirection = 'desc',
        } = queryDto;

        const skip = (pageNumber - 1) * pageSize;
        const limit = pageSize;
        const sort: Record<string, 1 | -1> = { [sortBy]: sortDirection === 'asc' ? 1 : -1 };

        const [items, totalCount] = await Promise.all([
            commentsRepository.findManyByPostId(postId, skip, limit, sort),
            commentsRepository.countByPostId(postId),
        ]);

        return mapToCommentListPaginatedOutput(items, {
            pageNumber,
            pageSize,
            totalCount,
        });


    },

    async updateComment(id: string, content: string): Promise<Result<null>> {
        const updateResult = await commentsRepository.updateComment(id, content);

        if (!updateResult) {
            return {
                status: ResultStatus.NotFound,
                extensions: [{ field: "id", message: "Comment not found" }],
                data: null,
            };
        }

        return {
            status: ResultStatus.Success,
            extensions: [],
            data: null,
        };
    },

    async deleteById(id: string): Promise<void> {
        await commentsRepository.deleteById(id);
        return;
    }

};
