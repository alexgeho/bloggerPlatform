import { Omit } from 'utility-types'; // если нужен import, либо сам объяви тип
import { PostDb } from '../domain/postDb';
import {ObjectId, WithId} from 'mongodb';
import {PostInputDto} from '../application/dtos/post.input-dto';
import {PostQueryInput} from "../routers/input/post-query.input";
import {RepositoryNotFoundError} from "../../../core/errors/repository-not-found.error";
import {PostModel} from "../domain/post.mangoose";

export const postsQwRepository = {

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



    async findById(id: string): Promise<PostDb | null> {
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

};
