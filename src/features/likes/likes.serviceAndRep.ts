import {likesRepository} from "./likes.repository";
import {LikeStatus} from "./domain/like-status.enum";

export const likesService = {

    // LIKES FOR POSTS

    async likeToPost (postId: string, userId: string, likeStatus: string) {

        const likeExists = await likesRepository.findOne(postId, userId);

        if (!likeExists) {
            await likesRepository.createLikeOnPost(postId, userId, likeStatus)
        }


    },


    // LIKES FOR COMMENTS
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
