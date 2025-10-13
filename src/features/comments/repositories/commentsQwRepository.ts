import { ObjectId } from 'mongodb';
import { CommentModel } from '../domain/comment.mangoose';
import { LikeStatus } from '../../likes/domain/like-status.enum';
import {LikeModel} from "../../likes/domain/like.entity";

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
};
