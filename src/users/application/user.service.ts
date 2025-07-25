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
import {Result} from "../../auth/common/result/result.type";
import {IUserDB} from "../../auth/types/user.db.interface";
import {ResultStatus} from "../../auth/common/result/resultCode";
import {bcryptService} from "../../auth/adapters/bcrypt.service";

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


        const newUser: User = {
            _id: new ObjectId(),
            login: dto.login,
            email: dto.email,
            passwordHash,
            passwordSalt,
            createdAt: new Date(),
        }
        const id = await userRepository.create(newUser);

        return {id, login: newUser.login, email: newUser.email, createdAt: newUser.createdAt.toISOString()};
    },

    async _generateHash(password: string, salt: string) {
        const hash = await bcrypt.hash(password, salt)
        return hash;
    },


    async delete(id: string): Promise<void> {

        await userRepository.delete(id);
        return;
    },

    async checkUserCredentials(
        loginOrEmail: string,
        password: string,
    ): Promise<Result<WithId<IUserDB> | null>> {
        const user = await userRepository.findByLoginOrEmail(loginOrEmail);
        if (!user)
            return {
                status: ResultStatus.NotFound,
                data: null,
                errorMessage: 'Not Found',
                extensions: [{ field: 'loginOrEmail', message: 'Not Found' }],
            };

        const isPassCorrect = await bcryptService.checkPassword(password, user.passwordHash);
        if (!isPassCorrect)
            return {
                status: ResultStatus.BadRequest,
                data: null,
                errorMessage: 'Bad Request',
                extensions: [{ field: 'password', message: 'Wrong password' }],
            };

        return {
            status: ResultStatus.Success,
            data: user,
            extensions: [],
        };
    },


};
