import {User} from '../../auth/domain/user';
import {ObjectId, WithId} from 'mongodb';
import {RepositoryNotFoundError} from '../../../core/errors/repository-not-found.error';
import {UserQueryInput} from '../routers/input/user-query.input';
import {UserModel} from "../../auth/domain/user-mangoose.entity";

export class UserRepository {

    async updateUserWithNewPassword (user: User, passwordHash:string, passwordSalt: string): Promise<void> {

        await UserModel.updateOne(
            {_id: user._id},
            {
                $set: {
                    'accountData.passwordHash': passwordHash,
                    'accountData.passwordSalt': passwordSalt,
                    'emailConfirmation.isConfirmed': true
                }
            }
        )
    }

    async updatePasswordRecovery(email: string, recoveryCode: string, expirationDate: Date): Promise<void> {

        const result = await UserModel.updateOne(
            {
                'accountData.email': email
            },
            {
                $set: {
                    'emailRecovery.recoveryCode': recoveryCode,
                    'emailRecovery.expirationDate': expirationDate
                }
            }
        )
    }

    async findMany(queryDto: UserQueryInput): Promise<{ items: WithId<User>[]; totalCount: number }> {

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
            .find({$or: [searchLogin, searchEmail]})
            .sort({[sortBy]: sortDirection})
            .skip(skip)
            .limit(pageSize)


        const totalCount = await UserModel.countDocuments({$or: [searchLogin, searchEmail]});

        return {items, totalCount};
    }

    async create(newUser: User): Promise<string> {
        const insertResult
            = await UserModel.insertOne(newUser);
        return insertResult._id.toString();
    }

    async updateConfirmation(user: User): Promise<boolean> {
        const result = await UserModel.updateOne(
            {_id: new ObjectId(user._id)},
            {
                $set: {
                    'emailConfirmation.isConfirmed': true
                }
            }
        );
        return result.matchedCount === 1;
    }

    async findByConfirmationCode(code: string) {
        return UserModel.findOne({
            'emailConfirmation.confirmationCode': code
        });
    }

    async uptateCodeAndDate(user: User): Promise<boolean> {
        const result = await UserModel.updateOne(
            {_id: new ObjectId(user._id)},
            {
                $set: {
                    'emailConfirmation.expirationDate': user.emailConfirmation.expirationDate,
                    'emailConfirmation.confirmationCode': user.emailConfirmation.confirmationCode,
                }});

        return result.modifiedCount === 1;
    }

    async delete(id: string): Promise<void> {
        const user = await UserModel.findByIdAndDelete(id);
        if (!user) throw new RepositoryNotFoundError('User not exist');
    }

    async findOne({ login, email }: { login?: string; email?: string }): Promise<WithId<User> | null> {
        if (!login && !email) return null;
        return UserModel.findOne({ $or: [{ login }, { email }] });
    }

    async findByLoginOrEmail(identifier: string) {
        return UserModel.findOne({
            $or: [
                {'accountData.login': identifier},
                {'accountData.email': identifier}
            ]
        });
    }


    async findByEmail(email: string): Promise<User | null> {
        return UserModel.findOne({"accountData.email": email});
    }

    async findByCode(code: string): Promise<User | null> {
        return UserModel.findOne({"emailConfirmation.confirmationCode": code});
    }

    async findByRecoveryCode(code: string): Promise<User | null> {
        return UserModel.findOne({"emailRecovery.recoveryCode": code});
    }

//todo find user by id
};

