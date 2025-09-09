import {Request, Response} from 'express';
import {refreshCookieOptions} from '../../../../../core/http/cookie';
import {jwtService} from "../../../adapters/jwt.service";
import {authService} from "../../../application/auth.service";

export async function logoutHandler(
    req: Request,
    res: Response
): Promise<void> {


    const {userId, deviceId, userAgent, lastActiveDate, expireAt} = (req as any).user;

    const result =   await authService.terminateSession (userId, deviceId, userAgent, lastActiveDate, expireAt);

    if (result) {

        res.sendStatus(204);
    } else {
        res.sendStatus(401);
    }




}
