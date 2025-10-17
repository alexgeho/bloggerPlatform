import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import {ENV} from "../../config/env";

export interface JwtPayload {
    userId: string;
    deviceId?: string;
    iat?: number;
    exp?: number;
}

// Middleware, который не требует токен, но извлекает userId, если он есть
export function accessTokenOptionalMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const authHeader = req.headers.authorization;
    console.log('authHeader::::::::', authHeader)
    // Если нет заголовка Authorization — просто идём дальше
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return next();
    }

    const token = authHeader.split(' ')[1];

    console.log('token::::::::', token)

    try {
        const decoded = jwt.verify(token, ENV.AC_SECRET) as JwtPayload;
        // Добавляем userId в объект запроса
        req.user = { userId: decoded.userId };



    } catch (err) {
        console.log('JWT verify error:::::::::', err);

    }

    next();
}
