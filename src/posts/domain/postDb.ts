import { ObjectId } from 'mongodb';


export type PostDb = {
    _id: ObjectId; // <== добавь это поле!
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string
    createdAt: string;
};

export type PostView = PostDb & {
    blogName: string | null;
};