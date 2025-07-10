import { blogsRepository } from '../repositories/blogs.repository';
import { WithId } from 'mongodb';
import { Blog } from '../domain/blog';
import { DomainError } from '../../core/errors/domain.error';
import { BlogQueryInput } from '../routers/input/blog-query.input';
import {BlogInputDto} from "./dtos/blog.input-dto";


export const blogsService = {


    async findMany( queryDto: BlogQueryInput)
        : Promise<{ items: WithId<Blog>[]; totalCount: number }> {
        return blogsRepository.findMany(queryDto);
    },

    async findByIdOrFail(id: string): Promise<WithId<Blog>> {
        return blogsRepository.findByIdOrFail(id);
    },

    async create(dto: BlogInputDto): Promise<string> {
        const newBlog: Blog = {


            name: dto.name,
            description: dto.description,
            websiteUrl: dto.websiteUrl,
            createdAt: new Date().toISOString(), // Всегда новая дата, как строка
            isMembership: false


        };

        return blogsRepository.create(newBlog);
    },

    async update(id: string, dto: BlogInputDto): Promise<void> {
        await blogsRepository.update(id, dto);
        return;
    },

    async delete(id: string): Promise<void> {
        const activeRide = await blogsRepository.findActiveRideByDriverId(id);

        if (activeRide) {
            throw new DomainError(
                `Driver has an active ride. Complete or cancel the ride first`,
                DriverErrorCode.HasActiveRide,
            );
        }

        await blogsRepository.delete(id);
        return;
    },
};
