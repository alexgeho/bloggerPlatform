import {HydratedDocument, model, Model, Schema} from "mongoose";

type LikeForPost = {
    postId: string,
    userId: string,
    myStatus: string,
    createdAt: Date
}

const likeSchema = new Schema({
    postId: {type: String, required: true},
    userId: {type: String, required: true},
    myStatus: {type: String},
    createdAt: {type: Date}
})

type LikeForPostModel = Model<LikeForPost>;
export type LikeForPostDocument = HydratedDocument<LikeForPost>;
export const LikeForPostModel: LikeForPostModel = model<LikeForPost, LikeForPostModel>('LikeForPost', likeSchema);