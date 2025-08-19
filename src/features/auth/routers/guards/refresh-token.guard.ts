import { Request, Response, NextFunction, RequestHandler } from 'express';
import { verifyRefreshTokenWithDevice, JwtRefreshWithDevice } from '../../adapters/jwt.service';

// augment Express Request with `refresh`
declare global {
    namespace Express { interface Request { refresh?: JwtRefreshWithDevice } }
}

export const refreshTokenGuard: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    const token = req.cookies?.refreshToken as string | undefined;

    console.log('=== TEST refreshTokenGuard ===', token);

    if (!token) { res.sendStatus(401); return; }
    const p = await verifyRefreshTokenWithDevice(token);

    console.log('=== TEST refreshTokenGuard ===', p);

    if (!p) { res.sendStatus(401); return; }
    req.refresh = p;
    next();
};

export {};