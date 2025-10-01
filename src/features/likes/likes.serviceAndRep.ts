import { LikeDocument, LikeModel } from "./domain/like.entity";

export const likesService = {
    async findLike(commentId: string, userId: string): Promise<LikeDocument | null> {
        return LikeModel.findOne({ commentId, userId });
    },

    async setLike(like: LikeDocument): Promise<LikeDocument> {
        return like.save();
    },

    async createLike(commentId: string, userId: string, likeStatus: "None" | "Like" | "Dislike"): Promise<LikeDocument> {
        const newLike = new LikeModel({
            commentId,
            userId,
            myStatus: likeStatus,
            createdAt: new Date().toISOString(),
        });
        return newLike.save();
    },
};
