import { Request, Response } from 'express';
import { refreshCookieOptions } from '../../../../core/http/cookie';
import {jwtService} from "../../adapters/jwt.service";

export async function logoutHandler(
    req: Request,
    res: Response
): Promise<void>
{
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
         res.sendStatus(401);
        return// токена нет
    }

    const payload = await jwtService.verifyRefreshToken(refreshToken);
    if (!payload) {
         res.sendStatus(401);
        return// токен просрочен или сломан
    }

    res.clearCookie('refreshToken', refreshCookieOptions);
     res.sendStatus(204);
    return
}
