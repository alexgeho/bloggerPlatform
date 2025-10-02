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

export const commentsService = {

    async setLikeStatus(
        commentId: string,
        userId: string,
        likeStatus: "None" | "Like" | "Dislike"
    ): Promise<"COMMENT_NOT_FOUND" | "USER_NOT_FOUND" | "UPDATED"> {

        // проверяем коммент
        const commentExist = await commentsRepository.findById(commentId);
        if (!commentExist) return "COMMENT_NOT_FOUND";

        console.log("commentExistDoc 26: ", commentExist)

        // проверяем юзера
        const userExist = await userRepository.findById(userId);
        if (!userExist) return "USER_NOT_FOUND";

        console.log("userExist 32: ", userExist)

        // ищем лайк
        const likeExisting = await likesService.findLike(commentId, userId);

        console.log("likeExisting 37: ", likeExisting)

        if (likeExisting) {
            // если статус не изменился или новый статус None → ничего не делаем
            if (commentExist.likesInfo.myStatus === likeStatus || likeStatus === "None") {
                return "UPDATED";
            }

            // убираем старый
            if (commentExist.likesInfo.myStatus === "Like") {
                commentExist.likesInfo.likesCount--;
            }
            if (commentExist.likesInfo.myStatus === "Dislike") {
                commentExist.likesInfo.dislikesCount--;
            }

            // добавляем новый
            if (likeStatus === "Like") {
                commentExist.likesInfo.likesCount++;
            }
            if (likeStatus === "Dislike") {
                commentExist.likesInfo.dislikesCount++;
            }

            commentExist.likesInfo.myStatus = likeStatus;

            await commentExist.save();
            return "UPDATED";
        }


// S1
        // if (likeExisting) {
        //     if (commentExist.likesInfo.myStatus === likeStatus) {
        //         return "UPDATED"; // ничего не меняем
        //     }
        //
        //     if (likeStatus !== "None") {
        //         if (likeStatus === "Like") {
        //             commentExist.likesInfo.myStatus = "Like";
        //             commentExist.likesInfo.likesCount++;
        //         }
        //
        //         if (likeStatus === "Dislike") {
        //             commentExist.likesInfo.myStatus = "Dislike";
        //             commentExist.likesInfo.dislikesCount++;
        //         }
        //     }
        //
        //     await commentExist.save();
        //     return "UPDATED";
        // }


        const newLike = await likesService.createLike(commentId, userId, likeStatus);

        if (newLike.myStatus === "Like") {
            commentExist.likesInfo.likesCount++;
        } else if (newLike.myStatus === "Dislike") {
            commentExist.likesInfo.dislikesCount++;
        }
        console.log('comExist 76: ', commentExist)
        await commentExist.save()

        return "UPDATED";
    },

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

    async findManyCommentsByPostId(
        postId: string,
        queryDto: CommentQueryInput
    ): Promise<ReturnType<typeof mapToCommentListPaginatedOutput>> {
        const {
            pageNumber,
            pageSize,
            sortBy = "createdAt",
            sortDirection = "desc",
        } = queryDto;

        const skip = (pageNumber - 1) * pageSize;
        const limit = pageSize;
        const sort: Record<string, 1 | -1> = {
            [sortBy]: sortDirection === "asc" ? 1 : -1,
        };

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
