import {ObjectId} from "mongodb";

export type DeviceSession = {
    deviceId?: ObjectId;
    userId: ObjectId | string;
    ip: string;
    userAgent: string;
    lastActiveDate: null | Date;
    expireAt: null | Date;
};

