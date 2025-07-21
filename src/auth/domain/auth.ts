import { ObjectId } from "mongodb";

export type Auth = {
    _id: ObjectId;
    login: string;
    email: string;
    passwordHash: string;
    passwordSalt: string;
    createdAt: Date;
};
