import {ObjectId} from "mongodb";

export type DeviceSession = {
    deviceId: string; // _id.toString()
    userId: ObjectId | string;    ip: string;
    userAgent: string;
    lastActiveDate: string;
    expireAt: Date;
};

