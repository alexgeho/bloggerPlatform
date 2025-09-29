import { ObjectId } from "mongodb";
import {HydratedDocument, model, Model, Schema} from "mongoose";

type Comment = {
    _id: ObjectId;
    postId: ObjectId;
    content: string;
    createdAt: string;
    commentatorInfo: {
        userId: string;
        userLogin: string;
    };
};

const CommentSchema = new Schema<Comment>({
    _id: ObjectId,
    postId: ObjectId,
    content: String,
    createdAt: String,
    commentatorInfo: {
        userId: String,
        userLogin: String
    }
})

type CommentModel = Model<Comment>;
export type CommentDocument = HydratedDocument<Comment>;
export const CommentModel: CommentModel = model<Comment, CommentModel>('comments', CommentSchema);
