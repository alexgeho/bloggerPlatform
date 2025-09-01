export type DeviceSession = {
    deviceId: string; // _id.toString()
    userId: string;
    ip: string;
    userAgent: string;
    lastActiveDate: string;
    expireAt: Date;
};

