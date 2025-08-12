import { Request, Response } from 'express';
import { refreshCookieOptions } from '../../../../core/http/cookie';

export async function logoutHandler(_req: Request, res: Response) {

    res.clearCookie('refreshToken', { ...refreshCookieOptions, maxAge: 0 });
    res.sendStatus(204);
}