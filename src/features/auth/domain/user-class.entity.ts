import {ObjectId} from 'mongodb';
import {randomUUID} from 'crypto';
import {add} from 'date-fns';


export class UserClassEntity {
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

    constructor(login: string, email: string, passwordHash: string, passwordSalt: string) {

        this._id = new ObjectId();

        this.accountData = {
            login,
            email,
            passwordHash,
            passwordSalt,
            createdAt: new Date(),
        };

        this.emailConfirmation = {
            confirmationCode: randomUUID(),
            expirationDate: add(new Date(), {hours: 1, minutes: 30}),
            isConfirmed: false
        };

        this.emailRecovery = {
            recoveryCode: null,
            expirationDate: null,
        };

    }


}