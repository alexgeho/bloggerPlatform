import mongoose, {Schema, model, Model, Types, HydratedDocument} from "mongoose";
import {randomUUID} from "crypto";
import {constructor} from "supertest";
import {ObjectId} from "mongodb";

type User = {
    _id: ObjectId;
    accountData: {
        login: string;
        email: string;
        passwordHash: string;
        passwordSalt: string;
        createdAt: Date;
    };
    emailConfirmation: {
        confirmationCode: string;
        expirationDate: Date;
        isConfirmed: boolean;
    };
    emailRecovery: {
        recoveryCode: string | null;
        expirationDate: Date | null;
    };
};

//userSchema
const accountData = new Schema({
    login: {type: String, required: true},
    email: {type: String, required: true},
    passwordHash: {type: String, required: true},
    passwordSalt: {type: String, required: true},
    createdAt: {type: Date, required: true},
})

const emailConfirmation = new Schema({
    confirmationCode: {type: String, required: true},
    expirationDate: {type: Date, required: true},
    isConfirmed: {type: Boolean, required: true},
})

const emailRecovery = new Schema({
    recoveryCode: {type: String, required: true},
    expirationDate: {type: Date, required: true},
})

const userSchema = new Schema<User>({
    accountData: {type: accountData, required: true},
    emailConfirmation: {type: emailConfirmation, required: true},
    emailRecovery: {type: emailRecovery, required: true},
})

type UserModel = Model<User>;
export type UserDocument = HydratedDocument<User>;
export const UserModel: UserModel = model<User, UserModel>('User', userSchema);




//
// constructor(login
// :
// string, email
// :
// string, passwordHash
// :
// string, passwordSalt
// :
// string
// )
// {
//
//     this._id = new ObjectId();
//
//     this.accountData = {
//         login,
//         email,
//         passwordHash,
//         passwordSalt,
//         createdAt: new Date(),
//     };
//
//     this.emailConfirmation = {
//         confirmationCode: randomUUID(),
//         expirationDate: add(new Date(), {hours: 1, minutes: 30}),
//         isConfirmed: false
//     };
//
//     this.emailRecovery = {
//         recoveryCode: null,
//         expirationDate: null,
//     };
//
// }
//
//
// }