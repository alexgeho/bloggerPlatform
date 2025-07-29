import {commentCollection} from '../../../db/mongo.db';
import {ObjectId, WithId} from 'mongodb';
import {CommentDb} from "../domain/commentDb";
import {CommentQueryInput} from "../routers/input/comment-query.input";
import {RepositoryNotFoundError} from "../../../core/errors/repository-not-found.error";
import {ResultStatus} from "../../auth/common/result/resultCode";
import {Result} from "../../auth/common/result/result.type";


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
    },

    async countByPostId(postId: string): Promise<number> {
        return commentCollection.countDocuments({ postId: new ObjectId(postId) });
    },

    async findById(id: string): Promise<WithId<CommentDb> | null> {
        return commentCollection.findOne({ _id: new ObjectId(id) });
    },

    async updateComment(id: string, content: string): Promise<Result<null>> {
        try {
            const result = await commentCollection.updateOne(
                { _id: new ObjectId(id) },
                { $set: { content } }
            );

            if (result.matchedCount === 0) {
                return {
                    status: ResultStatus.NotFound,
                    extensions: [{ field: "id", message: "Comment not found" }],
                    data: null,
                };
            }

            return {
                status: ResultStatus.Success,
                extensions: [],
                data: null,
            };
        } catch (error) {
            return {
                status: ResultStatus.InternalError,
                extensions: [{ field: "unknown", message: "Unexpected error" }],
                data: null,
            };
        }
    }


};
