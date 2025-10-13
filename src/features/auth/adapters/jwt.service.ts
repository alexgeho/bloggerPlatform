// jwtService.ts
import jwt from "jsonwebtoken";
import type {JwtPayload as BuiltInJWTPayload} from 'jsonwebtoken';
import { ENV } from "../../../core/config/env";
// import {deviceSessionsCollection} from "../../../db/mongo.db";
import { randomUUID } from "crypto";
import {ObjectId} from "mongodb";
import {DeviceSessionModel} from "../domain/device-session.mangoose";


// index -> a shto takoe index -> kakie byvajut -> BigO notation -> Big Theta notation

// Унифицированный payload для всех типов токенов
export interface JwtPayload extends BuiltInJWTPayload {
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
    async createAuthTokens(
        userId: string,
        deviceId: string,
        ):
        Promise<{
        accessToken: string;
        refreshToken: string;
        lastActiveDate: Date | null;
        expireAt: Date | null}> {

        const accessToken = jwt.sign(
            { userId, deviceId },
            ENV.AC_SECRET,
            { expiresIn: ENV.AC_TIME },

        );

        const refreshToken = jwt.sign(
            { userId, deviceId },
            ENV.RT_SECRET,
            { expiresIn: ENV.RT_TIME }
        );

        const decoded = jwt.decode(refreshToken) as { iat: number; exp: number };

        const expireAt = new Date(decoded.exp * 1000);
        const lastActiveDate = new Date(decoded.iat * 1000);

        return { accessToken, refreshToken, expireAt, lastActiveDate };

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


            const session = await DeviceSessionModel.findOne({
                userId: payload.userId,
                _id: new ObjectId(payload.deviceId),
            });


            if (!session) return null;

            if (session.expireAt && new Date(session.expireAt).getTime() < Date.now()) {
                return null;
            }


            return payload;
        } catch {
            return null;
        }
    },




};
