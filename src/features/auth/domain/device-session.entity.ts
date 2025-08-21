export type DeviceSession = {
    _id?: string;
    userId: string;
    ip: string;
    userAgent: string;
    lastActiveDate: string; // ← вместо iat/exp
};

