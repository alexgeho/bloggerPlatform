import { User } from '../domain/user';
import {authCollection, blogCollection, userCollection} from '../../db/mongo.db';
import { ObjectId, WithId } from 'mongodb';
import { RepositoryNotFoundError } from '../../core/errors/repository-not-found.error';
import { UserQueryInput } from '../routers/input/user-query.input';
import {UserInputDto} from "../application/dtos/user.input-dto";

export const usersQwRepository = {

    async findMany( queryDto: UserQueryInput): Promise<{ items: WithId<User>[]; totalCount: number }> {
        const {
            pageNumber,
            pageSize,
            sortBy,
            sortDirection,
            searchLoginTerm,
            searchEmailTerm
        } = queryDto;

   console.log("queryDto", queryDto, pageNumber, searchEmailTerm, searchLoginTerm)
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

        const items = await userCollection
            .find({$or: [searchLogin, searchEmail]})
            .sort({ [sortBy]: sortDirection })
            .skip(skip)
            .limit(pageSize)
            .toArray();

        const totalCount = await userCollection.countDocuments({$or: [searchLogin, searchEmail]});
        return { items, totalCount };
    },

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
        return userCollection.findOne(filter);
    },

    async findByLoginOrEmail(loginOrEmail: string) {

        const user = await userCollection.findOne({$or: [ {email: loginOrEmail}, {login: loginOrEmail}]})

        return user
    }

};
