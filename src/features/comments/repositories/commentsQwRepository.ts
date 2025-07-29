import {commentCollection} from '../../../db/mongo.db';
import {ObjectId, WithId} from 'mongodb';
import {CommentDb} from "../domain/commentDb";


export const commentsQwRepository = {

    async findById(id: string): Promise<WithId<CommentDb> | null> {
        return commentCollection.findOne({ _id: new ObjectId(id) });
    },

};
