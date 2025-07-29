import { postsRepository } from '../../posts/repositories/posts.repository';
import { commentsRepository } from '../comments.repository';
import { CommentDataOutput } from '../../posts/routers/output/comment-data.output';
import { CommentInputDto } from './dtos/comment.input-dto';
import { ObjectId } from 'mongodb';
import { CommentDb } from '../domain/commentDb';
import { CommentQueryInput } from '../routers/input/comment-query.input';
import { mapToCommentListPaginatedOutput } from '../routers/mappers/map-to-comment-list-paginated-output.util';
import {PromiseHooks} from "node:v8";
import { Result } from "../../auth/common/result/result.type";
import {ResultStatus} from "../../auth/common/result/resultCode";

export const commentsService = {

    async create(
        postId: string,
        dto: CommentInputDto,
        user: { userId: string; userLogin: string }
    ): Promise<CommentDataOutput> {
        const post = await postsRepository.findByIdOrFail(postId);
        if (!post) throw new Error('Post not found');

        const commentToSave: CommentDb = {
            _id: new ObjectId(),
            postId: new ObjectId(postId),
            content: dto.content,
            commentatorInfo: {
                userId: user.userId,
                userLogin: user.userLogin,
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

    async findManyByPostId(
        postId: string,
        queryDto: CommentQueryInput
    ): Promise<ReturnType<typeof mapToCommentListPaginatedOutput>> {
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
    }

};
