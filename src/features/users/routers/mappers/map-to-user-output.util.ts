import { WithId } from 'mongodb';
import { User } from '../../../auth/domain/user';
import { IUserDB } from '../../../auth/types/user.db.interface';

export function mapUserToUserDB(user: WithId<User>): WithId<IUserDB> {
    return {
        _id: user._id,
        login: user.accountData.login,
        email: user.accountData.email,
        passwordHash: user.accountData.passwordHash,
        createdAt: user.accountData.createdAt,
        // Добавь другие поля, если есть
    };
}
