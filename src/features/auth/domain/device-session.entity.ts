export interface DeviceSession {
    deviceId: string;
    userId: string;
    ip: string;
    title: string;
    lastActiveDate: string;   // ISO из iat refresh-токена
    refreshTokenExp: number;  // unix seconds
}