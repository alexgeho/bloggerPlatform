import {LikeModel} from "./domain/like.entity";

export const likesRepository = {
    async findOne(commentId: string, userId: string) {
        return LikeModel.findOne({ commentId, userId });
    },

    async create(data: any) {
        const like = new LikeModel(data);
        return like.save();
    },

    async update(commentId: string, userId: string, updateData: any) {
        await LikeModel.updateOne({ commentId, userId }, { $set: updateData });
    },

    async delete(commentId: string, userId: string) {
        await LikeModel.deleteOne({ commentId, userId });
    },
};
