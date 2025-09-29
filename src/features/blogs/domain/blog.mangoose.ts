import {HydratedDocument, model, Model, Schema} from "mongoose";

type Blog = {
    name: string;
    description: string;
    websiteUrl: string;
    createdAt: string;
    isMembership: boolean;
};

const BlogSchema = new Schema<Blog>({
    name: String,
    description: String,
    websiteUrl: String,
    createdAt: String,
    isMembership: Boolean,
})

type BlogModel = Model<Blog>;
export type BlogDocument = HydratedDocument<Blog>;
export const BlogModel: BlogModel = model<Blog, BlogModel>('blogs', BlogSchema);