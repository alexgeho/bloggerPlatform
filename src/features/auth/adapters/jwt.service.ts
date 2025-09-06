// jwtService.ts
import jwt from "jsonwebtoken";
import { ENV } from "../../../core/config/env";
import {deviceSessionsCollection} from "../../../db/mongo.db";

// Унифицированный payload для всех типов токенов
export interface JwtPayload {
    userId: string;
    userLogin: string;
    deviceId: string;
    userAgent: string;
    iat: number; // время создания токена (автоматически добавляется jwt)
    exp: number; // срок действия токена (автоматически добавляется jwt)
}

export const jwtService = {
    /**
     * Генерирует access и refresh токены сразу.
     * Access-токен содержит минимум данных, refresh — расширенный payload.
     */
    async createAuthTokens( userId: string, userLogin: string, userAgent: string, deviceId: string):
        Promise<{ accessToken: string; refreshToken: string; expireAt: string | null }> {
        const accessToken = jwt.sign(
            { userId, userLogin },
            ENV.AC_SECRET,
            { expiresIn: ENV.AC_TIME }
        );

        const refreshToken = jwt.sign(
            { userId, userLogin, userAgent, deviceId },
            ENV.RT_SECRET,
            { expiresIn: ENV.RT_TIME }
        );

        const decoded = jwt.decode(refreshToken) as { exp?: number };
        const expireAt = decoded?.exp ? new Date(decoded.exp * 1000).toISOString() : null;

        return { accessToken, refreshToken, expireAt };
    },
    /**
     * Проверяет access токен. Возвращает payload или null, если невалиден.
     */
    async verifyToken(token: string): Promise<JwtPayload | null> {
        try {
            return jwt.verify(token, ENV.AC_SECRET) as JwtPayload;
        } catch {
            return null;
        }
    },

    /**
     * Проверяет refresh токен. Дополнительно убеждается, что есть deviceId.
     */
    async verifyRefreshToken(token: string) {
        try {
            const payload: any = jwt.verify(token, ENV.RT_SECRET);
            if (!payload.deviceId) return null;


            const session = await deviceSessionsCollection.findOne({
                userId: payload.userId,
                deviceId: payload.deviceId,
            });


            if (!session) return null;


// проверяем, что токен не просрочен в базе
            if (session.expireAt && new Date(session.expireAt).getTime() < Date.now()) {
                return null;
            }


            return payload;
        } catch {
            return null;
        }
    },




};
