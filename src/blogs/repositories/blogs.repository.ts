import { Blog } from '../domain/blog';
import { blogCollection } from '../../db/mongo.db';
import { ObjectId, WithId } from 'mongodb';
import { RepositoryNotFoundError } from '../../core/errors/repository-not-found.error';
import { BlogQueryInput } from '../routers/input/blog-query.input';
import {BlogInputDto} from "../application/dtos/blog.input-dto";

export const blogsRepository = {

    async findMany( queryDto: BlogQueryInput): Promise<{ items: WithId<Blog>[]; totalCount: number }> {
        const {
            pageNumber,
            pageSize,
            sortBy,
            sortDirection,
            searchBlogNameTerm

        } = queryDto;

        const skip = (pageNumber - 1) * pageSize;
        const filter: any = {};

        if (searchBlogNameTerm) {
            filter.name = { $regex: searchBlogNameTerm, $options: 'i' };
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
            throw new RepositoryNotFoundError('Blog not exist');
        }
        return res;
    },

    async findByIds(ids: string[]): Promise<WithId<Blog>[]> {
        const objectIds = ids.map(id => new ObjectId(id));
        return blogCollection.find({ _id: { $in: objectIds } }).toArray();
    },

    async create(newBlog: Blog): Promise<string> {
        const insertResult = await blogCollection.insertOne(newBlog);
        return insertResult.insertedId.toString();},

    async update(id: string, dto: BlogInputDto): Promise<void> {
        const updateResult = await blogCollection.updateOne(
            {
                _id: new ObjectId(id),
            },
            {
                $set: {
                    name: dto.name,
                    description: dto.description,
                    websiteUrl: dto.websiteUrl
                    },},);

        if (updateResult.matchedCount < 1) {
            throw new RepositoryNotFoundError('Blog not exist');}
        return;},

    async delete(id: string): Promise<void> {
        const deleteResult = await blogCollection.deleteOne({
            _id: new ObjectId(id),
        });

        if (deleteResult.deletedCount < 1) {
            throw new RepositoryNotFoundError('Blog not exist');
        }
        return;
    },
};
