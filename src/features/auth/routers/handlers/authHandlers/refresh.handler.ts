import { Request, Response } from 'express';
import { authService } from '../../../application/auth.service';
import { ResultStatus } from '../../../common/result/resultCode';
import { refreshCookieOptions } from '../../../../../core/http/cookie';

export async function refreshHandler(req: Request, res: Response) {

    const token = (req as any).user.refreshToken;

    console.log('[refreshHandler] refreshToken from req.user:', token);

    const result = await authService.refreshTokens(token);

    if (result.status !== ResultStatus.Success) {
        res.status(401).send(result.extensions ?? { message: 'Unauthorized' });
        return;
    }

    const { accessToken, refreshTokenNew } = result.data!;

    res.cookie('refreshToken', refreshTokenNew, refreshCookieOptions);

    res.status(200).send({ accessToken });
}