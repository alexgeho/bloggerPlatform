import jwt from "jsonwebtoken";
import { appConfig } from "../common/config/config";

interface JwtPayload { userId: string; userLogin: string }

export const jwtService = {


    async createToken(userId: string, userLogin: string): Promise<string> {

        return jwt.sign({ userId, userLogin }, appConfig.AC_SECRET, {
            expiresIn: appConfig.AC_TIME,
        });
    },

    async verifyToken(token: string): Promise<JwtPayload | null> {
        try { return jwt.verify(token, appConfig.AC_SECRET) as JwtPayload; }
        catch { return null; }
    },

    async createRefreshToken(userId: string, userLogin: string, deviceId?:string): Promise<string> {

        return jwt.sign({ userId, userLogin, deviceId }, appConfig.RT_SECRET, {
            expiresIn: appConfig.RT_TIME,
        });
    },

    async verifyRefreshToken(token: string): Promise<JwtPayload | null> {
        try { return jwt.verify(token, appConfig.RT_SECRET) as JwtPayload; }
        catch { return null; }
    },

    async decodeToken(token: string): Promise<JwtPayload | null> {
        try { return jwt.decode(token) as JwtPayload; }
        catch { return null; }
    },
};

// FILE: src/features/auth/adapters/jwt.service.ts  (ДОБАВИТЬ вниз файла)
export interface JwtRefreshWithDevice {
    userId: string;
    userLogin: string;
    deviceId: string;
    iat: number;
    exp: number;
}

export async function createRefreshTokenWithDevice(userId: string, userLogin: string, userAgent: string):
    Promise<string> {
    return jwt.sign({ userId, userLogin, userAgent }, appConfig.RT_SECRET, { expiresIn: appConfig.RT_TIME });
}

export async function verifyRefreshTokenWithDevice(token: string): Promise<JwtRefreshWithDevice | null> {

    try {

        const openToken = jwt.verify(token, appConfig.RT_SECRET) as any;

        if (!openToken?.deviceId) return null;
        return {
            userId: openToken.userId,
            userLogin: openToken.userLogin,
            deviceId: openToken.deviceId,
            iat: openToken.iat,
            exp: openToken.exp };
    }

    catch (Error)

    {
        return null;
    }



}