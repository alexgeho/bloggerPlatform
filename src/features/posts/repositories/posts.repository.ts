import { Omit } from 'utility-types'; // если нужен import, либо сам объяви тип
import { PostDb } from '../domain/postDb';
import {ObjectId, WithId} from 'mongodb';
import {PostInputDto} from '../application/dtos/post.input-dto';
import {PostQueryInput} from "../routers/input/post-query.input";
import {RepositoryNotFoundError} from "../../../core/errors/repository-not-found.error";
import {PostModel} from "../domain/post.mangoose";

export const postsRepository = {

    async findMany(queryDto: PostQueryInput): Promise<{ items: WithId<PostDb>[]; totalCount: number }> {
        const {
            pageNumber,
            pageSize,
            sortBy,
            sortDirection,
            searchTitleTerm

        } = queryDto;

        const skip = (pageNumber - 1) * pageSize;
        const filter: any = {};

        if (searchTitleTerm) {
            filter.title = {$regex: searchTitleTerm, $options: 'i'};
        }

        const items = await PostModel
            .find(filter)
            .sort({[sortBy]: sortDirection})
            .skip(skip)
            .limit(pageSize)


        const totalCount = await PostModel.countDocuments(filter);

        return {items, totalCount};
    },

    async create(newPost: Omit<PostDb, '_id'>): Promise<string>  {
        const insertResult = await PostModel.insertOne(newPost);
        return insertResult._id.toString();
    },


    async findByIdOrFail(id: string): Promise<PostDb | null> {
        return PostModel.findOne({ _id: new ObjectId(id) });
    },


    async findByBlogIdWithPagination(
        blogId: string,
        pageNumber: number,
        pageSize: number,
        sortBy: string,
        sortDirection: string
    ) {
        const filter = { blogId: blogId }; // ! blogId должен быть string
        const sort = { [sortBy]: sortDirection === 'asc' ? 1 : -1 }; // для MongoDB

        // 1. Подсчёт общего количества постов
        const totalCount = await PostModel.countDocuments(filter);

        // 2. Получение нужной страницы постов
        const items = await PostModel
            .find(filter)
            .sort(sort as any)  // <-- вот так
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)


        return { items, totalCount };
    },




    async update(id: string, dto: PostInputDto): Promise<void> {
        const updateResult = await PostModel.updateOne(
            {
                _id: new ObjectId(id),
            },
            {
                $set: {
                    title: dto.title,
                    shortDescription: dto.shortDescription,
                    content: dto.content,
                    blogId: dto.blogId
                },
            },
        );

        if (updateResult.matchedCount < 1) {
            throw new RepositoryNotFoundError('Post not exist');
        }
        return;},


    async delete(id: string): Promise<void> {
        const deleteResult = await PostModel.deleteOne({
            _id: new ObjectId(id),
        });

        if (deleteResult.deletedCount < 1) {
            throw new RepositoryNotFoundError('Post not exist');
        }

        return;
    },
};
