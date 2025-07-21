import {userRepository} from '../repositories/user.repository';
import {WithId} from 'mongodb';
import {User} from '../domain/user';
import {UserInputDto} from "./dtos/user.input-dto";
import {UserDataOutput} from "../routers/output/user-data.output";
import {UserQueryInput} from "../routers/input/user-query.input";
import {response} from "express";

export const userService = {

    async findMany( queryDto: UserQueryInput): Promise<{ items: WithId<User>[]; totalCount: number }> {
        return userRepository.findMany(queryDto);
    },

    async create(dto: UserInputDto): Promise<UserDataOutput | { errorsMessages: { field: string, message: string }[] }> {

        const existingUser = await userRepository.findOne({ login: dto.login, email: dto.email });

        if (existingUser) {
            // Проверяем, что именно совпало
            if (existingUser.email === dto.email) {
                return {
                    errorsMessages: [{ field: 'email', message: 'email should be unique' }]
                }
            }
            if (existingUser.login === dto.login) {
                return {
                    errorsMessages: [{ field: 'login', message: 'login should be unique' }]
                }
            }
        }


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
