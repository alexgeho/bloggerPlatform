import jwt from "jsonwebtoken";
import { ENV } from "../../../core/config/env";

interface JwtPayload { userId: string; userLogin: string; userAgent: string; deviceId: string}

export const jwtService = {


    async createToken(userId: string, userLogin: string): Promise<string> {

        return jwt.sign({ userId, userLogin }, ENV.AC_SECRET, {
            expiresIn: ENV.AC_TIME,
        });
    },

    async createRefreshToken(userId: string, userLogin: string, deviceId?:string): Promise<string> {

        return jwt.sign({ userId, userLogin, deviceId }, ENV.RT_SECRET, {
            expiresIn: ENV.RT_TIME,
        });
    },

    async verifyRefreshToken(token: string): Promise<JwtPayload | null> {
        try { return jwt.verify(token, ENV.RT_SECRET) as JwtPayload; }
        catch { return null; }
    },

    // async decodeToken(token): Promise<JwtPayload | null> {
    //     try { return jwt.decode(token) as JwtPayload; }
    //     catch { return null; }
    // },

    async verifyToken(token: string): Promise<JwtPayload | null> {
        try {
            return jwt.verify(token, ENV.AC_SECRET) as JwtPayload;
        } catch {
            return null;
        }
    }

};



// FILE: src/features/auth/adapters/jwt.service.ts  (ДОБАВИТЬ вниз файла)
export interface JwtRefreshWithDevice {
    userId: string;
    userLogin: string;
    deviceId: string;
    iat: number;
    exp: number;
}

export async function createRefreshTokenWithDevice(userId: string, userLogin: string, userAgent: string, deviceId: string):
    Promise<string> {
    return jwt.sign({ userId, userLogin, userAgent, deviceId }, ENV.RT_SECRET, { expiresIn: ENV.RT_TIME });
}

export async function verifyRefreshTokenWithDevice(token: string): Promise<JwtRefreshWithDevice | null> {

    try {

        const openToken = jwt.verify(token, ENV.RT_SECRET) as any;

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