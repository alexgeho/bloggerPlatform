import { Request, Response } from 'express';
import { authService } from '../../../application/auth.service';
import { ResultStatus } from '../../../common/result/resultCode';
import { refreshCookieOptions } from '../../../../../core/http/cookie';

export async function refreshHandler(req: Request, res: Response) {

    const token = req.cookies?.refreshToken as string | undefined;

    if (!token) {
        res.status(401).send({ message: 'No refresh token' });
        return;
    }

    const reqUserAgent = req.headers['user-agent'] || 'unknown';

    const result = await authService.refreshTokens(token, reqUserAgent);

    if (result.status !== ResultStatus.Success) {
        res.status(401).send(result.extensions ?? { message: 'Unauthorized' });
        return;
    }

    const { accessToken, refreshToken } = result.data!;

    res.cookie('refreshToken', refreshToken, refreshCookieOptions);

    res.status(200).send({ accessToken });
}