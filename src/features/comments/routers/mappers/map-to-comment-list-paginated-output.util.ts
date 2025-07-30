import {WithId} from 'mongodb';
import {CommentDb} from '../../domain/commentDb';
import {CommentDataOutput} from '../output/comment-data.output';
import {PaginatedOutput} from "../../../../core/types/paginated.output";

export function mapToCommentListPaginatedOutput(
    comments: WithId<CommentDb>[],
    meta: { pageNumber: number; pageSize: number; totalCount: number }
): PaginatedOutput & { items: CommentDataOutput[] } {
    return {
        pagesCount: Math.ceil(meta.totalCount / meta.pageSize),
        page: meta.pageNumber,
        pageSize: meta.pageSize,
        totalCount: meta.totalCount,
        items: comments.map((comment) => ({
            id: comment._id.toString(),
            content: comment.content,
            commentatorInfo: {
                userId: comment.commentatorInfo.userId,
              userLogin: comment.commentatorInfo.userLogin,
            },
            createdAt: comment.createdAt,
        })),
    };
}
