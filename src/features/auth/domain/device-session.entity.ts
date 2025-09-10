import {ObjectId} from "mongodb";

export type DeviceSession = {
    _id?: ObjectId;
    userId: ObjectId | string;
    ip: string;
    userAgent: string;
    lastActiveDate: null | Date;
    expireAt: null | Date;
};


export type DeviceSessionGetType = {
    ip: string;
    title: string;
    lastActiveDate: string;
    deviceId: string;
}