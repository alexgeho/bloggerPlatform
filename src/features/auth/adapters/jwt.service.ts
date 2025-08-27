import jwt from "jsonwebtoken";
import { ENV } from "../../../core/config/env";

// Единый интерфейс payload'а для всех токенов
export interface JwtPayload {
    userId: string;
    userLogin: string;
    deviceId: string;
    userAgent?: string;
    iat: number;
    exp: number;
}

export const jwtService = {
    async createToken(userId: string, userLogin: string): Promise<string> {
        return jwt.sign({ userId, userLogin }, ENV.AC_SECRET, {
            expiresIn: ENV.AC_TIME,
        });
    },

    async createRefreshToken(userId: string, userLogin: string, deviceId?: string): Promise<string> {
        return jwt.sign({ userId, userLogin, deviceId }, ENV.RT_SECRET, {
            expiresIn: ENV.RT_TIME,
        });
    },

    async verifyToken(token: string): Promise<JwtPayload | null> {
        try {
            return jwt.verify(token, ENV.AC_SECRET) as JwtPayload;
        } catch {
            return null;
        }
    },

    async verifyRefreshToken(token: string): Promise<JwtPayload | null> {
        try {
            return jwt.verify(token, ENV.RT_SECRET) as JwtPayload;
        } catch {
            return null;
        }
    },

    // Расширенная версия с userAgent и deviceId — если нужно прямо при логине
    async createRefreshTokenWithDevice(
        userId: string,
        userLogin: string,
        userAgent: string,
        deviceId: string
    ): Promise<string> {
        return jwt.sign({ userId, userLogin, userAgent, deviceId }, ENV.RT_SECRET, {
            expiresIn: ENV.RT_TIME,
        });
    },

    async verifyRefreshTokenWithDevice(token: string): Promise<JwtPayload | null> {
        try {
            const payload = jwt.verify(token, ENV.RT_SECRET) as JwtPayload;
            if (!payload.deviceId) return null;
            return payload;
        } catch {
            return null;
        }
    }
};
