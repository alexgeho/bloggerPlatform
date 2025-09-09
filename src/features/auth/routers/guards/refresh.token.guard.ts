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




    (req as any).user = {
        userId: payload.userId,
        deviceId: payload.deviceId,
        refreshToken: token,
        userAgent: req.get('User-Agent') ?? '',
        ip: req.ip,
        lastActiveDate: payload.iat ? new Date(payload.iat * 1000).getTime() : undefined,
        expireAt: payload.exp ? new Date(payload.exp * 1000).getTime() : undefined,

    };



    next();
};
