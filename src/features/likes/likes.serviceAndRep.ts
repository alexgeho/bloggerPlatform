import { LikeDocument, LikeModel } from "./domain/like.entity";
import {likesRepository} from "./likes.repository";
import {LikeStatus} from "./domain/like-status.enum";

export const likesService = {
    async findLike(commentId: string, userId: string) {
        return likesRepository.findOne(commentId, userId);
    },

    async createLike(commentId: string, userId: string, status: LikeStatus) {
        const like = await likesRepository.create({
            commentId,
            userId,
            myStatus: status,
            createdAt: new Date().toISOString(),
        });
        return like;
    },

    async updateLike(commentId: string, userId: string, status: LikeStatus) {
        await likesRepository.update(commentId, userId, { myStatus: status });
    },

    async deleteLike(commentId: string, userId: string) {
        await likesRepository.delete(commentId, userId);
    },
};
