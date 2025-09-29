import {User} from '../../auth/domain/user';
import {ObjectId, WithId} from 'mongodb';
import {UserQueryInput} from '../routers/input/user-query.input';
import {UserModel} from "../../auth/domain/user-mangoose.entity";

export class UsersQwRepository {

    async findMany( queryDto: UserQueryInput): Promise<{ items: WithId<User>[]; totalCount: number }> {
        const {
            pageNumber,
            pageSize,
            sortBy,
            sortDirection,
            searchLoginTerm,
            searchEmailTerm
        } = queryDto;

        const skip = (pageNumber - 1) * pageSize;
        const searchLogin = searchLoginTerm
            ? {login: {$regex: searchLoginTerm, $options: 'i'}}
            : {}
        const searchEmail = searchEmailTerm
            ? {email: {$regex: searchEmailTerm, $options: 'i'}}
            : {}
        const filter = {
            ...searchLogin,
            ...searchEmail,
        }

        const items = await UserModel
            .find({ $or: [searchLogin, searchEmail] })
            .sort({ [sortBy]: sortDirection })
            .skip(skip)
            .limit(pageSize)

        const totalCount = await UserModel.countDocuments({$or: [searchLogin, searchEmail]});
        return { items, totalCount };
    }

    async findOne({ login, email }: { login?: string, email?: string }): Promise<WithId<User> | null> {
        const filter: any = {};
        if (login && email) {
            filter.$or = [{ login }, { email }];
        } else if (login) {
            filter.login = login;
        } else if (email) {
            filter.email = email;
        } else {
            return null;
        }
        return UserModel.findOne(filter);
    }

    async findById(id: string): Promise<User | null> {
        const user = await UserModel.findOne({ _id: new ObjectId(id) });
        return user
    }





}
