import {ObjectId, WithId} from 'mongodb';
import {CommentDb} from "../domain/commentDb";
import {CommentModel} from "../domain/comment.mangoose";


export const commentsQwRepository = {

    async findById(id: string): Promise<WithId<CommentDb> | null> {
        return CommentModel.findOne({ _id: new ObjectId(id) });
    },

};
