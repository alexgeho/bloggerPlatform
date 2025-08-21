import { Request, Response } from 'express';
import { refreshCookieOptions } from '../../../../../core/http/cookie';
import { jwtService } from "../../../adapters/jwt.service";
import { authService } from "../../../application/auth.service";

export async function logoutHandler(
    req: Request,
    res: Response
): Promise<void> {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
        res.sendStatus(401);
        return;
    }

    const payload = await jwtService.verifyRefreshToken(refreshToken);
    if (!payload) {
        res.sendStatus(401); // Токен просрочен/битый
        return;
    }

    // 🧼 Удаляем сессию устройства
    await authService.terminateDeviceSession(payload.userId, payload.deviceId);

    // 🍪 Удаляем куку с refreshToken
    res.clearCookie('refreshToken', refreshCookieOptions);
    res.sendStatus(204);
}
