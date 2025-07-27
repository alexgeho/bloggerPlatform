import { Omit } from 'utility-types'; // если нужен import, либо сам объяви тип
import { PostDb } from '../domain/postDb';
import {commentCollection, postCollection} from '../../../db/mongo.db';
import {ObjectId, WithId} from 'mongodb';
import {PostInputDto} from '../application/dtos/post.input-dto';
import {PostQueryInput} from "../routers/input/post-query.input";
import {RepositoryNotFoundError} from "../../../core/errors/repository-not-found.error";
import {CommentDb} from "../domain/commentDb";

export const commentsRepository = {



    async create(commentToSave: CommentDb): Promise<string> {
        const insertResult = await commentCollection.insertOne(commentToSave);
        return insertResult.insertedId.toString();
    }

    //
    // async findMany(queryDto: PostQueryInput): Promise<{ items: WithId<PostDb>[]; totalCount: number }> {
    //     const {
    //         pageNumber,
    //         pageSize,
    //         sortBy,
    //         sortDirection,
    //         searchTitleTerm
    //
    //     } = queryDto;
    //
    //     const skip = (pageNumber - 1) * pageSize;
    //     const filter: any = {};
    //
    //     if (searchTitleTerm) {
    //         filter.title = {$regex: searchTitleTerm, $options: 'i'};
    //     }
    //
    //     const items = await postCollection
    //         .find(filter)
    //         .sort({[sortBy]: sortDirection})
    //         .skip(skip)
    //         .limit(pageSize)
    //         .toArray();
    //
    //     const totalCount = await postCollection.countDocuments(filter);
    //
    //     return {items, totalCount};
    // },
    //
    // async findByIdOrFail(id: string): Promise<PostDb | null> {
    //     return await postCollection.findOne({ _id: new ObjectId(id) });
    // },
    //
    //
    // async findByBlogIdWithPagination(
    //     blogId: string,
    //     pageNumber: number,
    //     pageSize: number,
    //     sortBy: string,
    //     sortDirection: string
    // ) {
    //     const filter = { blogId: blogId }; // ! blogId должен быть string
    //     const sort = { [sortBy]: sortDirection === 'asc' ? 1 : -1 }; // для MongoDB
    //
    //     // 1. Подсчёт общего количества постов
    //     const totalCount = await postCollection.countDocuments(filter);
    //
    //     // 2. Получение нужной страницы постов
    //     const items = await postCollection
    //         .find(filter)
    //         .sort(sort as any)  // <-- вот так
    //         .skip((pageNumber - 1) * pageSize)
    //         .limit(pageSize)
    //         .toArray();
    //
    //     return { items, totalCount };
    // },
    //
    //
    //
    //
    // async update(id: string, dto: PostInputDto): Promise<void> {
    //     const updateResult = await postCollection.updateOne(
    //         {
    //             _id: new ObjectId(id),
    //         },
    //         {
    //             $set: {
    //                 title: dto.title,
    //                 shortDescription: dto.shortDescription,
    //                 content: dto.content,
    //                 blogId: dto.blogId
    //             },
    //         },
    //     )
    //     console.log('update result', updateResult)
    //     ;
    //
    //     if (updateResult.matchedCount < 1) {
    //         throw new RepositoryNotFoundError('Post not exist');
    //     }
    //     return;},
    //
    //
    // async delete(id: string): Promise<void> {
    //     const deleteResult = await postCollection.deleteOne({
    //         _id: new ObjectId(id),
    //     });
    //
    //     if (deleteResult.deletedCount < 1) {
    //         throw new RepositoryNotFoundError('Post not exist');
    //     }
    //
    //     return;
    // },
};
