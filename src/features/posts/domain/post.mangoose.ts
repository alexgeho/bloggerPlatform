import { ObjectId } from 'mongodb';
import {HydratedDocument, model, Model, Schema} from "mongoose";


type Post = {
    _id: ObjectId;
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string
    createdAt: string;
};

const PostSchema = new Schema<Post>({
    title: String,
    shortDescription: String,
    content: String,
    blogId: String,
    blogName: String,
    createdAt: String,
})

type PostModel = Model<Post>;
export type PostDocument = HydratedDocument<Post>;
export const PostModel: PostModel = model <Post, PostModel>('posts', PostSchema)