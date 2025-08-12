import jwt from "jsonwebtoken";
import { appConfig } from "../common/config/config";

interface JwtPayload { userId: string; userLogin: string }

export const jwtService = {
    async createToken(userId: string, userLogin: string): Promise<string> {
        return jwt.sign({ userId, userLogin }, appConfig.AC_SECRET, {
            expiresIn: appConfig.AC_TIME,            // <- число, не `${}s`
        });
    },

    async verifyToken(token: string): Promise<JwtPayload | null> {
        try { return jwt.verify(token, appConfig.AC_SECRET) as JwtPayload; }
        catch { return null; }
    },

    async createRefreshToken(userId: string, userLogin: string): Promise<string> {
        return jwt.sign({ userId, userLogin }, appConfig.RT_SECRET, {
            expiresIn: appConfig.RT_TIME,            // <- число
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
