import { ObjectId } from "mongodb";

export type CommentDb = {
    _id: ObjectId;
    postId: ObjectId;
    content: string;
    createdAt: string;
    commentatorInfo: {
        userId: string;
        userLogin: string;
    };
};
