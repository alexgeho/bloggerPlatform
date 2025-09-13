import {User} from '../../auth/domain/user';
import {userCollection} from '../../../db/mongo.db';
import {ObjectId, WithId} from 'mongodb';
import {RepositoryNotFoundError} from '../../../core/errors/repository-not-found.error';
import {UserQueryInput} from '../routers/input/user-query.input';

export class UserRepository {

    async updatePasswordRecovery (email: string, code: string, expirationDate: Date): Promise<void> {

        const result = await userCollection.updateOne(
            {
                'accountData.email': email,
                'emailConfirmation.confirmationCode': code,
                'emailConfirmation.expirationDate': expirationDate
            },
            {
                $set: {
                    'emailConfirmation.isConfirmed': false
                }
            }
        )
    }

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

        const items = await userCollection
            .find({$or: [searchLogin, searchEmail]})
            .sort({ [sortBy]: sortDirection })
            .skip(skip)
            .limit(pageSize)
            .toArray();

        const totalCount = await userCollection.countDocuments({$or: [searchLogin, searchEmail]});

        return { items, totalCount };
    }

     async create(newUser: User): Promise<string> {
        const insertResult = await userCollection.insertOne(newUser);
        return insertResult.insertedId.toString();}

     async updateConfirmation(user: User): Promise<boolean> {
        const result = await userCollection.updateOne(
            { _id: new ObjectId(user._id) },
            {
                $set: {
                    'emailConfirmation.isConfirmed': true
                }
            }
        );
        return result.matchedCount === 1;
    }

     async findByConfirmationCode(code: string) {
        return userCollection.findOne({
            'emailConfirmation.confirmationCode': code
        });
    }

     async uptateCodeAndDate(user: User): Promise<boolean> {
        const result = await userCollection.updateOne(
            { _id: new ObjectId(user._id) },
            {
                $set: {
                    'emailConfirmation.expirationDate': user.emailConfirmation.expirationDate,
                    'emailConfirmation.confirmationCode': user.emailConfirmation.confirmationCode,
                }
            }
        );

        return result.modifiedCount === 1;
    }

     async delete(id: string): Promise<void> {
        const deleteResult = await userCollection.deleteOne({
            _id: new ObjectId(id),
        });

        if (deleteResult.deletedCount < 1) {
            throw new RepositoryNotFoundError('User not exist');
        }
        return;
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
        return userCollection.findOne(filter);
    }

     async findByLoginOrEmail(identifier: string) {
        return userCollection.findOne({
            $or: [
                { 'accountData.login': identifier },
                { 'accountData.email': identifier }
            ]
        });
    }

     async forTestfindByLoginOrEmail(login: string, email: string) {
        return userCollection.findOne(
            {
                $or: [
                    { "accountData.email": email },
                    { "accountData.login": login }
                ]
            }
        )


    }

    async findByEmail(email: string): Promise<User | null> {
        return await userCollection.findOne({ "accountData.email": email });
    }

    async findByCode(code: string): Promise<User | null> {
        return await userCollection.findOne({ "emailConfirmation.confirmationCode": code });
    }



};

