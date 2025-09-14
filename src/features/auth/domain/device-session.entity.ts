import {ObjectId} from "mongodb";

export class DeviceSession {
    _id?: ObjectId;
    userId: ObjectId | string;
    ip: string;
    userAgent: string;
    lastActiveDate?: null | Date;
    expireAt?: null | Date;

    constructor (userId: ObjectId | string, ip: string, userAgent: string, lastActiveDate?: Date | null, expireAt?: Date | null) {
        this.userId = userId;
        this.ip = ip;
        this.userAgent = userAgent;
        this.lastActiveDate = lastActiveDate;
        this.expireAt = expireAt;
    }
}

export class DeviceSessionGetType {
    ip: string;
    title: string;
    lastActiveDate: string;
    deviceId: string;

    constructor (ip: string, title: string, lastActiveDate: string, deviceId: string) {
        this.ip = ip;
        this.title = title;
        this.lastActiveDate = lastActiveDate;
        this.deviceId = deviceId;
    }

}