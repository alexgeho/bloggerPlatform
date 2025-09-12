import bcrypt from 'bcrypt';
import {WithId} from "mongodb";
import { UserRepository} from '../repositories/user.repository';
import {User} from '../../auth/domain/user';
import {UserInputDto} from "./dtos/user.input-dto";
import {UserDataOutput} from "../routers/output/user-data.output";
import {UserQueryInput} from "../routers/input/user-query.input";
import {Result} from "../../auth/common/result/result.type";
import {IUserDB} from "../../auth/types/user.db.interface";
import {ResultStatus} from "../../auth/common/result/resultCode";
import {mapUserToUserDB} from "../routers/mappers/map-to-user-output.util";
import {UserEntity} from "../../auth/domain/user.entity";
import {emailManager} from "../../auth/adapters/email.manager";
import {bcryptService} from "../../../composition-root";


export class UserService {

        constructor(private usersRepository: UserRepository) {
    }

    async findMany(queryDto: UserQueryInput): Promise<{ items: WithId<User>[]; totalCount: number }> {
        return this.usersRepository.findMany(queryDto);
    }



    async create(dto: UserInputDto): Promise<UserDataOutput | {
        errorsMessages: { field: string, message: string }[]
    }> {
        const existingUser = await this.usersRepository.findOne({login: dto.login, email: dto.email});

        if (existingUser) {
            // Проверяем, что именно совпало
            if (existingUser.accountData.email === dto.email) {
                return {
                    errorsMessages: [{field: 'email', message: 'email should be unique'}]
                }
            }
            if (existingUser.accountData.login === dto.login) {
                return {
                    errorsMessages: [{field: 'login', message: 'login should be unique'}]
                }
            }
        }

        const passwordSalt = await bcrypt.genSalt(10)
        const passwordHash: any = await this._generateHash(dto.password, passwordSalt)

        const newUser: User = new UserEntity (dto.login, dto.email, passwordHash, passwordSalt)

        const id = await this.usersRepository.create(newUser);

        await emailManager
            .sendConfirmationEmail(newUser.accountData.email, newUser.emailConfirmation.confirmationCode);

        return {id, login: newUser.accountData.login, email: newUser.accountData.email, createdAt: newUser.accountData.createdAt.toISOString()};
    }

    async _generateHash(password: string, salt: string) {
        const hash = await bcrypt.hash(password, salt)
        return hash;
    }


    async delete(id: string): Promise<void> {

        await this.usersRepository.delete(id);
        return;
    }

    async checkUserCredentials(
        loginOrEmail: string,
        password: string,
    ): Promise<Result<WithId<IUserDB> | null>> {
        const user = await this.usersRepository.findByLoginOrEmail(loginOrEmail);
        if (!user)
            return {
                status: ResultStatus.NotFound,
                data: null,
                errorMessage: 'Not Found',
                extensions: [{ field: 'loginOrEmail', message: 'Not Found' }],
            };

        const isPassCorrect = await bcryptService.checkPassword(password, user.accountData.passwordHash);
        if (!isPassCorrect)
            return {
                status: ResultStatus.BadRequest,
                data: null,
                errorMessage: 'Bad Request',
                extensions: [{ field: 'password', message: 'Wrong password' }],
            };

        return {
            status: ResultStatus.Success,
            data: mapUserToUserDB(user),
            extensions: [],
        };
    }


};
