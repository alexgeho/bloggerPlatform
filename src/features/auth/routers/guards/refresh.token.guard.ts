import { NextFunction, Request, Response } from 'express';
import { jwtService } from '../../adapters/jwt.service';

export const refreshTokenGuard = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {

    const token = req.cookies?.refreshToken;

    if (!token) {
        res.sendStatus(401);
        return;
    }

    const payload = await jwtService.verifyRefreshToken(token);

    if (!payload) {
        res.sendStatus(401);
        return;
    }



    // Делаем доступным токен и userId в req
    (req as any).user = {
        userId: payload.userId,
        deviceId: payload.deviceId,
        refreshToken: token,
        userAgent: req.get('User-Agent') ?? '',
        ip: req.ip,
    };


    // (req as any).deviceId = payload.deviceId;
    // (req as any).refreshToken = token;

    next();
};
