import { Schema, model, HydratedDocument } from "mongoose";
import { ObjectId } from "mongodb";

export type Like = {
    commentId: string;
    userId: string;
    myStatus: "None" | "Like" | "Dislike";
    createdAt: string;
};

export type LikeDocument = HydratedDocument<Like>;

const LikeSchema = new Schema<Like>({
    commentId: { type: String, required: true },
    userId: { type: String, required: true },
    myStatus: { type: String, enum: ["None", "Like", "Dislike"], required: true },
    createdAt: { type: String, required: true },
});

export const LikeModel = model<Like>("Like", LikeSchema);
