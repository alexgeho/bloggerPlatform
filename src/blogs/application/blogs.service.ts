import { blogsRepository } from '../repositories/blogs.repository';
import { WithId } from 'mongodb';
import { Blog } from '../domain/blog';
import { DomainError } from '../../core/errors/domain.error';
import { BlogQueryInput } from '../routers/input/blog-query.input';
import {BlogInputDto} from "./dtos/blog.input-dto";
import {BlogDataOutput} from "../routers/output/blog-data.output";


export const blogsService = {


    async findMany( queryDto: BlogQueryInput)
        : Promise<{ items: WithId<Blog>[]; totalCount: number }> {
        return blogsRepository.findMany(queryDto);
    },

    async findByIdOrFail(id: string): Promise<WithId<Blog>> {
        return blogsRepository.findByIdOrFail(id);
    },

    async create(dto: BlogInputDto): Promise<BlogDataOutput> {
        const newBlog: Blog = {
            name: dto.name,
            description: dto.description,
            websiteUrl: dto.websiteUrl,
            createdAt: new Date().toISOString(),
            isMembership: true,
        };
        const id = await blogsRepository.create(newBlog);
        return { id, ...newBlog };
    },


    async update(id: string, dto: BlogInputDto): Promise<void> {
        await blogsRepository.update(id, dto);
        return;
    },

    async delete(id: string): Promise<void> {

        await blogsRepository.delete(id);
        return;
    },
};
