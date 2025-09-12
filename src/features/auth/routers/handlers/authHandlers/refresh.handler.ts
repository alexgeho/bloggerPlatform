import { Request, Response } from 'express';
import { ResultStatus } from '../../../common/result/resultCode';
import { refreshCookieOptions } from '../../../../../core/http/cookie';
import {authService} from "../../../../../composition-root";

export async function refreshHandler(req: Request, res: Response) {

    const token = (req as any).user.refreshToken;


    const result = await authService.refreshTokens(token);

    if (result.status !== ResultStatus.Success) {
        res.status(401).send(result.extensions ?? { message: 'Unauthorized' });
        return;
    }

    const { accessToken, refreshTokenNew } = result.data!;

    res.cookie('refreshToken', refreshTokenNew, refreshCookieOptions);

    res.status(200).send({ accessToken });
}