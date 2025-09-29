import { Blog } from '../domain/blog';
import { ObjectId, WithId } from 'mongodb';
import { RepositoryNotFoundError } from '../../../core/errors/repository-not-found.error';
import { BlogQueryInput } from '../routers/input/blog-query.input';
import {BlogInputDto} from "../application/dtos/blog.input-dto";
import {BlogModel} from "../domain/blog.mangoose";

export const blogsRepository = {

    async findMany( queryDto: BlogQueryInput): Promise<{ items: WithId<Blog>[]; totalCount: number }> {

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

    async create(newBlog: Blog): Promise<string> {
        const insertResult = await BlogModel.insertOne(newBlog);
        return insertResult._id.toString();},

    async update(id: string, dto: BlogInputDto): Promise<void> {
        const updateResult = await BlogModel.updateOne(
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
        const deleteResult = await BlogModel.deleteOne({
            _id: new ObjectId(id),
        });

        if (deleteResult.deletedCount < 1) {
            throw new RepositoryNotFoundError('Blog not exist');
        }
        return;
    },
};
