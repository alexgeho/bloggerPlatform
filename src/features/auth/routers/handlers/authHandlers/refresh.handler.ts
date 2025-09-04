import { Request, Response } from 'express';
import { authService } from '../../../application/auth.service';
import { ResultStatus } from '../../../common/result/resultCode';
import { refreshCookieOptions } from '../../../../../core/http/cookie';

export async function refreshHandler(req: any, res: any) {
    const { refreshToken } = req.user; // достаём токен из guard

    const result = await authService.refreshTokens(refreshToken);
    if (!result || result.status !== ResultStatus.Success) return res.sendStatus(401);

// 👉 non-null assertion, и забираем новый RT под именем newRt
    const { accessToken, refreshToken: newRt } = result.data!;

    res.cookie('refreshToken', newRt, refreshCookieOptions);
    return res.status(200).send({ accessToken });}
