import {LikeModel} from "../domain/like-for-comment";

export const likesForCommentsRepository = {


    // LIKES FOR COMMENTS

    async findOne(commentId: string, userId: string) {
        return LikeModel.findOne({commentId, userId});
    },

    async create(data: any) {
        const like = new LikeModel(data);
        return like.save();
    },

    async update(commentId: string, userId: string, updateData: any) {
        await LikeModel.updateOne({commentId, userId}, {$set: updateData});
    },

    async delete(commentId: string, userId: string) {
        await LikeModel.deleteOne({commentId, userId});
    },
};
