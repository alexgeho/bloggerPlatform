import {userRepository} from '../repositories/user.repository';
import {WithId} from 'mongodb';
import {User} from '../domain/user';
import {UserInputDto} from "./dtos/user.input-dto";
import {UserDataOutput} from "../routers/output/user-data.output";

export const userService = {

    async findMany( queryDto: UserInputDto): Promise<{ items: WithId<User>[]; totalCount: number }> {
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
        return { id, login: newUser.login, email: newUser.email, createdAt: newUser.createdAt };
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
