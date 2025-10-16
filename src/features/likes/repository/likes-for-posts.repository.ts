import {LikeStatus} from "../domain/like-status.enum";
import {LikeForPostDocument, LikeForPostModel} from "../domain/like-for-post";

export const likesForPostsRepository = {

    async findOne(postId: string, userId: string) {
        return LikeForPostModel.findOne({ postId, userId });
    },

    async findManyByPost(postId: string) {
        return LikeForPostModel.find({ postId });
    },

    async create(postId: string, userId: string, likeStatus: string) {
        await LikeForPostModel.create({
            postId,
            userId,
            myStatus: likeStatus,
            createdAt: new Date().toISOString(),
        });
    },

    async update(postId: string, userId: string, updateData: Partial<LikeForPostDocument>) {
        await LikeForPostModel.updateOne({ postId, userId }, { $set: updateData });
    },

    async delete(postId: string, userId: string) {
        await LikeForPostModel.deleteOne({ postId, userId });
    },
};
