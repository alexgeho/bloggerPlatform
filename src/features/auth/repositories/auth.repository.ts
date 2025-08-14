import { blacklistCollection} from '../../../db/mongo.db';

export const authRepository = {

    // async create(newAuth: Auth): Promise<Auth> {
    //     await authCollection.insertOne(newAuth);
    //     return newAuth;
    // },
    //
    // // auth.repository.ts
    //
    // async findByLoginOrEmail(loginOrEmail: string) {
    //
    //     const auth = await authCollection.findOne({$or: [ {email: loginOrEmail}, {login: loginOrEmail}]})
    //
    //     return auth
    // },

    async blacklistToken(token: string): Promise<void> {
        await blacklistCollection.insertOne({ token: token, createdAt: new Date() });
    },

    async isTokenBlacklisted(token: string): Promise<boolean> {
        const found = await blacklistCollection.findOne({ blacklistedToken: token });
        return !!found;
    }




}


