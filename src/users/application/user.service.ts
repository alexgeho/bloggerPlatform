import { userRepository } from '../repositories/user.repository';
import { WithId } from 'mongodb';
import { User } from '../domain/user';
import { DomainError } from '../../core/errors/domain.error';
import {UserInputDto} from "./dtos/user.input-dto";
import {UserDataOutput} from "../routers/output/user-data.output";

export const userService = {

    async findMany( queryDto: UserInputDto)
        : Promise<{ items: WithId<User>[]; totalCount: number }> {
        return userRepository.findMany(queryDto);
    },

    async findByIdOrFail(id: string): Promise<WithId<User>> {
        return userRepository.findByIdOrFail(id);
    },

    async create(dto: UserInputDto): Promise<UserDataOutput> {
        const newUser: User = {
            login: dto.login,
            password: dto.password,
            email: dto.email,
            createdAt: new Date().toISOString()

        };
        const id = await userRepository.create(newUser);
        return { id, name: newUser.name, description: newUser.description, websiteUrl: newBlog.websiteUrl, createdAt: newBlog.createdAt, isMembership: newBlog.isMembership };
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
