import bcrypt from 'bcryptjs';
import {ObjectId} from "mongodb";
import {authRepository} from "../repositories/auth.repository";
import {Auth} from "../domain/auth";

export const authService = {

    async createAuth(login: string, email: string, password: string): Promise<Auth> {

        const passwordSalt = await bcrypt.genSalt(10)
        const passwordHash: any = await this._generateHash(password, passwordSalt)

        const newAuth: Auth = {
            _id: new ObjectId(),
            login,
            email,
            passwordHash,
            passwordSalt,
            createdAt: new Date(),
        }

        return authRepository.create(newAuth)
    },

    // async checkCredentials(loginOrEmail: string, password: string) {
    //     const auth = await authRepository.findByLoginOrEmail(loginOrEmail)
    //     if (!auth) return false
    //
    //     const isValid = await bcrypt.compare(password, auth.passwordHash)
    //     return isValid
    // },


    async checkCredentials(loginOrEmail: string, password: string) {
        const auth = await authRepository.findByLoginOrEmail(loginOrEmail)
        if (!auth) return false

        const passwordHash = await this._generateHash(password, auth.passwordSalt)

        if (auth.passwordHash !== passwordHash) {
            return false
        }
        return true
    },

    async _generateHash(password: string, salt: string) {
        const hash = await bcrypt.hash(password, salt)
        return hash;
    }


}