import {ObjectId, WithId} from 'mongodb';
import {CommentQueryInput} from "../routers/input/comment-query.input";
import {RepositoryNotFoundError} from "../../../core/errors/repository-not-found.error";
import {ResultStatus} from "../../auth/common/result/resultCode";
import {Result} from "../../auth/common/result/result.type";
import {CommentDocument, CommentModel} from "../domain/comment.mangoose";


export const commentsRepository = {

    async save(commentToSave: CommentDocument): Promise<CommentDocument> {

        return commentToSave.save()
    },

    async updateLikeStatus(commentId: string, userId: string, newStatus: "None" | "Like" | "Dislike"): Promise<boolean> {
        const comment = await CommentModel.findById(commentId);
        if (!comment) return false;

        // текущий статус
        const oldStatus = comment.likesInfo.myStatus;

        // если статус не поменялся → ничего не делаем
        if (oldStatus === newStatus) return true;

        // обновляем счётчики
        if (oldStatus === "Like") comment.likesInfo.likesCount--;
        if (oldStatus === "Dislike") comment.likesInfo.dislikesCount--;

        if (newStatus === "Like") comment.likesInfo.likesCount++;
        if (newStatus === "Dislike") comment.likesInfo.dislikesCount++;

        // сохраняем новый статус
        comment.likesInfo.myStatus = newStatus;

        await comment.save();
        return true;
    },

    async create(commentToSave: CommentDocument): Promise<string> {
        const insertResult = await CommentModel.insertOne(commentToSave);
        return insertResult._id.toString();
    },

    async findManyByPostId(postId: string, skip: number, limit: number, sort: Record<string, 1 | -1>): Promise<WithId<CommentDocument>[]> {
        return CommentModel
            .find({postId: postId})
            .sort(sort)
            .skip(skip)
            .limit(limit)

    },

    async countByPostId(postId: string): Promise<number> {
        return CommentModel.countDocuments({ postId: new ObjectId(postId) });
    },


    async findById(id: string): Promise<WithId<CommentDocument> | null> {
        return CommentModel.findOne({_id: new ObjectId(id)});
    },

    async updateComment(id: string, content: string): Promise<Result<null>> {
        try {
            const result = await CommentModel.updateOne(
                {_id: new ObjectId(id)},
                {$set: {content}}
            );

            if (result.matchedCount === 0) {
                return {
                    status: ResultStatus.NotFound,
                    extensions: [{field: "id", message: "Comment not found"}],
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
                extensions: [{field: "unknown", message: "Unexpected error"}],
                data: null,
            };
        }
    },

    async deleteById(id: string): Promise<void> {


        const deleteResult
            = await CommentModel.deleteOne({_id: new ObjectId(id)});

        if (deleteResult.deletedCount < 1) {
            throw new RepositoryNotFoundError('Comment not exist');
        }
        return;

    }

};
