import { ObjectId } from 'mongodb';
import { CommentModel } from '../domain/comment.mangoose';
import { LikeStatus } from '../../likes/domain/like-status.enum';
import {LikeModel} from "../../likes/domain/like-for-comment";

export const commentsQwRepository = {
    async findById(id: string, userId?: string) {
        const comment = await CommentModel.findOne({ _id: new ObjectId(id) });
        if (!comment) return null;

        if (!userId) {
            comment.likesInfo.myStatus = LikeStatus.None;
            return comment;
        }

        const like = await LikeModel.findOne({ commentId: id, userId });
        comment.likesInfo.myStatus = (like?.myStatus as LikeStatus) ?? LikeStatus.None;

        return comment;
    },

    async findCommentsByPostId(
        postId: string,
        userId?: string,
        pageNumber = 1,
        pageSize = 10,
        sortBy = 'createdAt',
        sortDirection: 'asc' | 'desc' = 'desc'
    ) {
        const filter = { postId: new ObjectId(postId) };
        const totalCount = await CommentModel.countDocuments(filter);

        const comments = await CommentModel.find(filter)
            .sort({ [sortBy]: sortDirection === 'asc' ? 1 : -1 })
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .lean();

        const items = await Promise.all(
            comments.map(async (comment) => {
                let myStatus = LikeStatus.None;

                if (userId) {
                    const userLike = await LikeModel.findOne({
                        commentId: comment._id.toString(),
                        userId: userId.toString(), // ✅ важно — строкой!
                    }).lean();

                    if (userLike?.myStatus) {
                        myStatus = userLike.myStatus as LikeStatus;
                    }
                }

                return {
                    id: comment._id.toString(),
                    content: comment.content,
                    commentatorInfo: comment.commentatorInfo,
                    createdAt: comment.createdAt,
                    likesInfo: {
                        likesCount: comment.likesInfo.likesCount,
                        dislikesCount: comment.likesInfo.dislikesCount,
                        myStatus,
                    },
                };
            })
        );

        return {
            pagesCount: Math.ceil(totalCount / pageSize),
            page: pageNumber,
            pageSize,
            totalCount,
            items,
        };
    },



};
