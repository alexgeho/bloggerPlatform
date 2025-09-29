import { Blog } from '../domain/blog';
import { ObjectId, WithId } from 'mongodb';
import { RepositoryNotFoundError } from '../../../core/errors/repository-not-found.error';
import { BlogQueryInput } from '../routers/input/blog-query.input';
import {BlogModel} from "../domain/blog.mangoose";

export const blogsQwRepository = {

    async findMany( queryDto: BlogQueryInput): Promise<{ items: WithId<Blog>[]; totalCount: number }> {
      //  console.log('[findMany] queryDto:', queryDto);

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

        const items = await BlogModel
            .find(filter)
            .sort({ [sortBy]: sortDirection })
            .skip(skip)
            .limit(pageSize)

        const totalCount = await BlogModel.countDocuments(filter);

        return { items, totalCount };
    },

    async findById(id: string): Promise<WithId<Blog> | null> {
        return BlogModel.findOne({ _id: new ObjectId(id) });
    },

    async findByIdOrFail(id: string): Promise<WithId<Blog>> {
        const res = await BlogModel.findOne({ _id: new ObjectId(id) });

        if (!res) {
            throw new RepositoryNotFoundError('Blog not exist2');
        }
        return res;
    },

    async findByIds(ids: string[]): Promise<WithId<Blog>[]> {
        const objectIds = ids.map(id => new ObjectId(id));
        return BlogModel.find({ _id: { $in: objectIds } });
    },


};
