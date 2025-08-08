import jwt from "jsonwebtoken";
import { appConfig } from "../common/config/config";

interface JwtPayload {
    userId: string;
    userLogin: string;
}

export const jwtService = {

    async createToken(userId: string, userLogin: string): Promise<string> {
        return jwt.sign({ userId, userLogin }, appConfig.AC_SECRET, {
            expiresIn: `${appConfig.AC_TIME}s`,
        });
    },

    async decodeToken(token: string): Promise<JwtPayload | null> {
        try {
            return jwt.decode(token) as JwtPayload;
        } catch (e) {
            console.error("Can't decode token", e);
            return null;
        }
    },

    async verifyToken(token: string): Promise<JwtPayload | null> {
        try {
            return jwt.verify(token, appConfig.AC_SECRET) as JwtPayload;
        } catch (error) {
            console.error("Token verify error", error);
            return null;
        }
    },
};
