import { userService } from '../../users/application/user.service';
import { ResultStatus } from '../common/result/resultCode';
import { Result } from '../common/result/result.type';
import { jwtService } from '../adapters/jwt.service';
import { WithId } from 'mongodb';
import { IUserDB } from '../types/user.db.interface';

export const authService = {
    async checkCredentials(
        loginOrEmail: string,
        password: string
    ): Promise<Result<{ accessToken: string } | null>> {
        const result = await userService.checkUserCredentials(loginOrEmail, password);

        if (result.status !== ResultStatus.Success) return result;

        const user: WithId<IUserDB> = result.data!;
        const accessToken = await jwtService.createToken(user._id.toString());

        return {
            status: ResultStatus.Success,
            data: { accessToken },
            extensions: [],
        };
    },
};
