import { Blog } from '../domain/blog';
import { blogCollection } from '../../db/mongo.db';
import { ObjectId, WithId } from 'mongodb';
import { RepositoryNotFoundError } from '../../core/errors/repository-not-found.error';
import { BlogQueryInput } from '../routers/input/blog-query.input';
import {BlogInputDto} from "../application/dtos/blog.input-dto";

export const blogsQwRepository = {

    async findMany( queryDto: BlogQueryInput): Promise<{ items: WithId<Blog>[]; totalCount: number }> {
        console.log('[findMany] queryDto:', queryDto);

        const {
            pageNumber,
            pageSize,
            sortBy,
            sortDirection,
            searchNameTerm

        } = queryDto;

        const skip = (pageNumber - 1) * pageSize;
        const filter: any = {};

        if (searchNameTerm) {
            filter.name = { $regex: searchNameTerm, $options: 'i' };
        }

        const items = await blogCollection
            .find(filter)
            .sort({ [sortBy]: sortDirection })
            .skip(skip)
            .limit(pageSize)
            .toArray();

        const totalCount = await blogCollection.countDocuments(filter);

        return { items, totalCount };
    },

    async findById(id: string): Promise<WithId<Blog> | null> {
        return blogCollection.findOne({ _id: new ObjectId(id) });
    },

    async findByIdOrFail(id: string): Promise<WithId<Blog>> {
        const res = await blogCollection.findOne({ _id: new ObjectId(id) });

        if (!res) {
            throw new RepositoryNotFoundError('Blog not exist2');
        }
        return res;
    },

    async findByIds(ids: string[]): Promise<WithId<Blog>[]> {
        const objectIds = ids.map(id => new ObjectId(id));
        return blogCollection.find({ _id: { $in: objectIds } }).toArray();
    },


};
