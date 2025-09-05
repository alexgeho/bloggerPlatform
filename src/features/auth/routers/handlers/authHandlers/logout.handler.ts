import { Request, Response } from 'express';
import { refreshCookieOptions } from '../../../../../core/http/cookie';
import { jwtService } from "../../../adapters/jwt.service";
import { authService } from "../../../application/auth.service";

export async function logoutHandler(req: Request, res: Response): Promise<void> {

    const user = (req as any).user;

    await authService.terminateDeviceSession(user.userId, user.deviceId);


    res.clearCookie('refreshToken');
    res.sendStatus(204);
}
