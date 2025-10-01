import { ObjectId } from "mongodb";
import { HydratedDocument, model, Model, Schema } from "mongoose";

type LikeStatus = "None" | "Like" | "Dislike";

type Comment = {
    id: ObjectId;
    postId: string;
    content: string;
    createdAt: string;
    commentatorInfo: {
        userId: string;
        userLogin: string;
    };
    likesInfo: {
        likesCount: number;
        dislikesCount: number;
        myStatus: LikeStatus;
    };
};

const CommentSchema = new Schema<Comment>({
    postId:{ type: String, required: true },
    content: { type: String, required: true },
    createdAt: { type: String, required: true },
    commentatorInfo: {
        userId: { type: String, required: true},
        userLogin: { type: String, required: true},
    },
    likesInfo: {
        likesCount: { type: Number, default: 0 },
        dislikesCount: { type: Number, default: 0 },
        myStatus: {
            type: String,
            enum: ["None", "Like", "Dislike"],
            default: "None",
        },
    },
});

type CommentModel = Model<Comment>;
export type CommentDocument = HydratedDocument<Comment>;
export const CommentModel: CommentModel = model<Comment, CommentModel>(
    "comments",
    CommentSchema
);
