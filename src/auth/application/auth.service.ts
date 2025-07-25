import { userService } from '../../users/application/user.service';
import { ResultStatus } from '../common/result/resultCode';
import { Result } from '../common/result/result.type';
import { jwtService } from '../adapters/jwt.service';
import { WithId } from 'mongodb';
import { IUserDB } from '../types/user.db.interface';
import {userRepository} from "../../users/repositories/user.repository";

export const authService = {
    async checkCredentials(
        loginOrEmail: string,
        password: string

    ): Promise<Result<{ accessToken: string } | null>> {

        const result = await userService.checkUserCredentials(loginOrEmail, password);

        if (result.status !== ResultStatus.Success) {
            return {
                status: ResultStatus.Unauthorized,
                errorMessage: 'Unauthorized',
                extensions: [{ field: 'loginOrEmail', message: 'Wrong credentials'}],
                data: null
            };
        }


        const accessToken = await jwtService.createToken(result.data!._id.toString());

        return {
            status: ResultStatus.Success,
            data: { accessToken },
            extensions: [],
        };
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
