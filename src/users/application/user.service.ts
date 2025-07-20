import {userRepository} from '../repositories/user.repository';
import {WithId} from 'mongodb';
import {User} from '../domain/user';
import {UserInputDto} from "./dtos/user.input-dto";
import {UserDataOutput} from "../routers/output/user-data.output";
import {UserQueryInput} from "../routers/input/user-query.input";

export const userService = {

    async findMany( queryDto: UserQueryInput): Promise<{ items: WithId<User>[]; totalCount: number }> {
        return userRepository.findMany(queryDto);
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



    async delete(id: string): Promise<void> {

        await userRepository.delete(id);
        return;
    },
};
