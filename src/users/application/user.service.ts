import { userRepository } from '../repositories/user.repository';
import { WithId } from 'mongodb';
import { Blog } from '../domain/blog';
import { DomainError } from '../../core/errors/domain.error';
import {UserInputDto} from "./dtos/user.input-dto";

export const userService = {

    async findMany( queryDto: UserInputDto)
        : Promise<{ items: WithId<User>[]; totalCount: number }> {
        return userRepository.findMany(queryDto);
    },

    async findByIdOrFail(id: string): Promise<WithId<User>> {
        return userRepository.findByIdOrFail(id);
    },

    async create(dto: UserInputDto): Promise<BlogDataOutput> {
        const newBlog: Blog = {
            name: dto.name,
            description: dto.description,
            websiteUrl: dto.websiteUrl,
            createdAt: new Date().toISOString(),
            isMembership: false,
        };
        const id = await userRepository.create(newBlog);
        return { id, name: newBlog.name, description: newBlog.description, websiteUrl: newBlog.websiteUrl, createdAt: newBlog.createdAt, isMembership: newBlog.isMembership };
    },


    async update(id: string, dto: UserInputDto): Promise<void> {
        await userRepository.update(id, dto);
        return;
    },

    async delete(id: string): Promise<void> {

        await userRepository.delete(id);
        return;
    },
};
