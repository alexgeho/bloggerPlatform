import { ObjectId } from 'mongodb';

export type AuthDBType = {
    _id: ObjectId;
    userName: string;
    email: string;
    passwordHash: string;
    passwordSalt: string;
    createdAt: Date;
};
