import {commentCollection} from '../../db/mongo.db';
import {ObjectId, WithId} from 'mongodb';
import {CommentDb} from "./domain/commentDb";
import {CommentQueryInput} from "./routers/input/comment-query.input";
import {RepositoryNotFoundError} from "../../core/errors/repository-not-found.error";

export const commentsRepository = {



    async create(commentToSave: CommentDb): Promise<string> {
        const insertResult = await commentCollection.insertOne(commentToSave);
        return insertResult.insertedId.toString();
    },

    async findManyByPostId(
        postId: string,
        skip: number,
        limit: number,
        sort: Record<string, 1 | -1>
    ): Promise<WithId<CommentDb>[]> {
        return commentCollection
            .find({ postId: new ObjectId(postId) })
            .sort(sort)
            .skip(skip)
            .limit(limit)
            .toArray();
    }

,

    async countByPostId(postId: string): Promise<number> {
        return commentCollection.countDocuments({ postId: new ObjectId(postId) });
    },

    async findById(id: string): Promise<WithId<CommentDb> | null> {
        return commentCollection.findOne({ _id: new ObjectId(id) });
    },

async updateComment (id: string, content: string): Promise <void>{

const updateResult = await commentCollection.updateOne(
    {_id: new ObjectId(id)},
    {$set: {content: content}},
)
    if (updateResult.matchedCount < 1) {
        throw new RepositoryNotFoundError('Comment not exist');
    }
    return;

}

};
