import { PostDb } from '../domain/postDb';
import { postCollection } from '../../db/mongo.db';
import {ObjectId, WithId} from 'mongodb';
// import { RepositoryNotFoundError } from '../../core/errors/repository-not-found.error';
import {PostInputDto} from '../application/dtos/post.input-dto';
import {PostQueryInput} from "../routers/input/post-query.input";

export const postsRepository = {

    async findMany(queryDto: PostQueryInput): Promise<{ items: WithId<PostDb>[]; totalCount: number }> {
        const {
            pageNumber,
            pageSize,
            sortBy,
            sortDirection,
            searchPostNameTerm

        } = queryDto;

        const skip = (pageNumber - 1) * pageSize;
        const filter: any = {};

        if (searchPostNameTerm) {
            filter.name = {$regex: searchPostNameTerm, $options: 'i'};
        }

        const items = await postCollection
            .find(filter)
            .sort({[sortBy]: sortDirection})
            .skip(skip)
            .limit(pageSize)
            .toArray();

        const totalCount = await postCollection.countDocuments(filter);

        return {items, totalCount};
    },




    async create(newPost: PostDb): Promise<string> {
        const insertResult = await postCollection.insertOne(newPost);
        return insertResult.insertedId.toString();
    },



    async findById(id: string): Promise<PostDb | null> {
        return await postCollection.findOne({ _id: new ObjectId(id) });
    },
//
//     async findByIdOrFail(id: string): Promise<WithId<Blog>> {
//         const res = await blogCollection.findOne({ _id: new ObjectId(id) });
//
//         if (!res) {
//             throw new RepositoryNotFoundError('Driver not exist');
//         }
//         return res;
//     },
//

//
//     async update(id: string, dto: BlogInputDto): Promise<void> {
//         const updateResult = await blogCollection.updateOne(
//             {
//                 _id: new ObjectId(id),
//             },
//             {
//                 $set: {
//                     name: dto.name,
//                     description: dto.description,
//                     websiteUrl: dto.websiteUrl
//                 },
//             },
//         );
//
//         if (updateResult.matchedCount < 1) {
//             throw new RepositoryNotFoundError('Blog not exist');
//         }
//
//         return;
//     },
//
//     async delete(id: string): Promise<void> {
//         const deleteResult = await blogCollection.deleteOne({
//             _id: new ObjectId(id),
//         });
//
//         if (deleteResult.deletedCount < 1) {
//             throw new RepositoryNotFoundError('Blog not exist');
//         }
//
//         return;
//     },
};
