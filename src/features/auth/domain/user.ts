import {ObjectId} from "mongodb";

export type User = {
    _id: ObjectId;
    accountData: {
        login: string;
        email: string;
        passwordHash: string;
        passwordSalt: string;
        createdAt: Date
    },
    emailConfirmation: {
        confirmationCode: string;
        expirationDate: Date;
        isConfirmed: boolean;
    };

}
