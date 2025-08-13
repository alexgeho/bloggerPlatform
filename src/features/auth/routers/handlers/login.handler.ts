import { Request, Response } from 'express';
import { errorsHandler } from '../../../../core/errors/errors.handler';
import { authService } from '../../application/auth.service';
import { refreshCookieOptions } from '../../../../core/http/cookie';
import { sendResult } from '../../../../core/http/send-result';
import {ResultStatus} from "../../common/result/resultCode";

export async function loginHandler(req: Request, res: Response) {
    console.log('=== TEST loginHandler ===');
    try {
        const { loginOrEmail, password } = req.body ?? {};
        if (!loginOrEmail || !password) {
            res.status(400).send({ message: 'loginOrEmail and password are required' });
            return;
        }

        const result = await authService.loginUser(loginOrEmail, password);
        if (result.status === ResultStatus.Success) {
            const { accessToken, refreshToken /*, user*/ } = (result as any).data;
            res.cookie('refreshToken', refreshToken, refreshCookieOptions);
        }
        sendResult(res, result, 200);
    } catch (e) {
        errorsHandler(e, res);
    }
}
