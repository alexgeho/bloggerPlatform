import {ObjectId, WithId} from 'mongodb';
import {CommentDocument, CommentModel} from "../domain/comment.mangoose";


export const commentsQwRepository = {

    async findById(id: string): Promise<WithId<CommentDocument> | null> {
        return CommentModel.findOne({ _id: new ObjectId(id) });
    },

};
