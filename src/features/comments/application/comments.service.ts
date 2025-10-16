import {postsRepository} from '../../posts/repositories/posts.repository';
import {commentsRepository} from '../repositories/comments.repository';
import {CommentDataOutput} from '../routers/output/comment-data.output';
import {CommentInputDto} from './dtos/comment.input-dto';
import {CommentQueryInput} from '../routers/input/comment-query.input';
import {mapToCommentListPaginatedOutput} from '../routers/mappers/map-to-comment-list-paginated-output.util';
import {Result} from "../../auth/common/result/result.type";
import {ResultStatus} from "../../auth/common/result/resultCode";
import {userRepository} from "../../../composition-root";
import {CommentDocument, CommentModel} from "../domain/comment.mangoose";
import {ObjectId} from "mongodb";
import {likesService} from "../../likes/likes.serviceAndRep";
import {LikeStatus} from "../../likes/domain/like-status.enum";
import {commentsQwRepository} from "../repositories/commentsQwRepository";

export const commentsService = {

    async findManyCommentsByPostId(
        postId: string,
        query: CommentQueryInput,
        userId?: string
    ) {
        return commentsQwRepository.findCommentsByPostId(
            postId,
            userId,
            query.pageNumber,
            query.pageSize,
            query.sortBy,
            query.sortDirection
        );
    },

    async setLikeStatus(commentId: string, userId: string, likeStatus: LikeStatus) {
        const comment = await commentsRepository.findById(commentId);
        if (!comment) return 'COMMENT_NOT_FOUND';

        const user = await userRepository.findById(userId);
        if (!user) return 'USER_NOT_FOUND';

        const existingLike = await likesService.findLike(commentId, userId);

        if (existingLike) {
            // ✅ 1. Если статус не изменился — просто выходим, ничего не трогаем
            if (existingLike.myStatus === likeStatus) {
                return 'UPDATED';
            }

            // ✅ 2. Если пользователь хочет убрать лайк (likeStatus = None)
            if (likeStatus === LikeStatus.None) {
                if (existingLike.myStatus === LikeStatus.Like) comment.likesInfo.likesCount--;
                if (existingLike.myStatus === LikeStatus.Dislike) comment.likesInfo.dislikesCount--;

                await likesService.deleteLike(commentId, userId);
                await comment.save();
                return 'UPDATED';
            }

            // ✅ 3. Если статус поменялся (Like ↔ Dislike)
            if (existingLike.myStatus === LikeStatus.Like) comment.likesInfo.likesCount--;
            if (existingLike.myStatus === LikeStatus.Dislike) comment.likesInfo.dislikesCount--;

            if (likeStatus === LikeStatus.Like) comment.likesInfo.likesCount++;
            if (likeStatus === LikeStatus.Dislike) comment.likesInfo.dislikesCount++;

            existingLike.myStatus = likeStatus;
            await existingLike.save();
            await comment.save();
            return 'UPDATED';
        }

        // ✅ 4. Если лайка ещё не было
        if (likeStatus !== LikeStatus.None) {
            await likesService.createLike(commentId, userId, likeStatus);

            if (likeStatus === LikeStatus.Like) comment.likesInfo.likesCount++;
            if (likeStatus === LikeStatus.Dislike) comment.likesInfo.dislikesCount++;

            await comment.save();
        }

        return 'UPDATED';
    }

    ,

    async create(
        postId: string,
        dto: CommentInputDto,
        user: { userId: string }
    ): Promise<CommentDataOutput> {
        const post = await postsRepository.findByIdOrFail(postId);
        if (!post) throw new Error("Post not found");

        const userById = await userRepository.findById(user.userId);
        if (!userById) throw new Error("User not found");

        const commentToSave: CommentDocument = new CommentModel({
            id: new ObjectId(),
            postId,
            content: dto.content,
            createdAt: new Date().toISOString(),
            commentatorInfo: {
                userId: user.userId,
                userLogin: userById.accountData.login,
            },
            likesInfo: {
                likesCount: 0,
                dislikesCount: 0,
                myStatus: "None",
            },
        });

        const savedComment = await commentsRepository.save(commentToSave);

        return {
            id: savedComment._id.toString(),
            content: savedComment.content,
            commentatorInfo: savedComment.commentatorInfo,
            createdAt: savedComment.createdAt,
            likesInfo: savedComment.likesInfo,
        };
    },


    async updateComment(id: string, content: string): Promise<Result<null>> {
        const updateResult = await commentsRepository.updateComment(id, content);
        if (!updateResult) {
            return {
                status: ResultStatus.NotFound,
                extensions: [{field: "id", message: "Comment not found"}],
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
    },
};
