import bcrypt from 'bcryptjs';
import {ObjectId} from "mongodb";
import {userRepository} from '../repositories/user.repository';
import {WithId} from 'mongodb';
import {User} from '../domain/user';
import {UserInputDto} from "./dtos/user.input-dto";
import {UserDataOutput} from "../routers/output/user-data.output";
import {UserQueryInput} from "../routers/input/user-query.input";
import {response} from "express";
import {authRepository} from "../../auth/repositories/auth.repository";

export const userService = {

    async findMany(queryDto: UserQueryInput): Promise<{ items: WithId<User>[]; totalCount: number }> {
        return userRepository.findMany(queryDto);
    },

    async create(dto: UserInputDto): Promise<UserDataOutput | {
        errorsMessages: { field: string, message: string }[]
    }> {

        const existingUser = await userRepository.findOne({login: dto.login, email: dto.email});

        if (existingUser) {
            // Проверяем, что именно совпало
            if (existingUser.email === dto.email) {
                return {
                    errorsMessages: [{field: 'email', message: 'email should be unique'}]
                }
            }
            if (existingUser.login === dto.login) {
                return {
                    errorsMessages: [{field: 'login', message: 'login should be unique'}]
                }
            }
        }

        const passwordSalt = await bcrypt.genSalt(10)
        const passwordHash: any = await this._generateHash(dto.password, passwordSalt)

        const now = new Date(); // <--- вот тут создаём дату один раз

        const newUser: User = {
            _id: new ObjectId(),
            login: dto.login,
            email: dto.email,
            passwordHash,
            passwordSalt,
            createdAt: now
        }
        const id = await userRepository.create(newUser);
        return {id, login: newUser.login, email: newUser.email, createdAt: new Date().toISOString()};
    },
    async _generateHash(password: string, salt: string) {
        const hash = await bcrypt.hash(password, salt)
        return hash;
    },


    async delete(id: string): Promise<void> {

        await userRepository.delete(id);
        return;
    },

    async checkCredentials(loginOrEmail: string, password: string) {
        const user = await userRepository.findByLoginOrEmail(loginOrEmail)
        if (!user) return false

        const passwordHash = await this._generateHash(password, user.passwordSalt)

        if (user.passwordHash !== passwordHash) {
            return false
        }
        return true
    },


};
