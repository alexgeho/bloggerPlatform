import { blacklistCollection} from '../../../db/mongo.db';

export const authRepository = {


    async blacklistToken(token: string): Promise<void> {
        await blacklistCollection.insertOne({ token: token, createdAt: new Date() });
    },

    async isTokenBlacklisted(token: string): Promise<boolean> {
        const found = await blacklistCollection.findOne({ token });
        return !!found;
    }
}


