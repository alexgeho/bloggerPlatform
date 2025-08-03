import {authCollection} from '../../../db/mongo.db';
import { Auth } from '../domain/auth';

export const authRepository = {

    async create(newAuth: Auth): Promise<Auth> {
        await authCollection.insertOne(newAuth);
        return newAuth;
    },

    // auth.repository.ts

    async findByLoginOrEmail(loginOrEmail: string) {

        const auth = await authCollection.findOne({$or: [ {email: loginOrEmail}, {login: loginOrEmail}]})

        return auth
    }


}


