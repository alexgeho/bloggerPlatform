import { Request, Response } from 'express';
import { errorsHandler } from '../../../../../core/errors/errors.handler';
import { authService } from '../../../application/auth.service';
import { refreshCookieOptions } from '../../../../../core/http/cookie';
import { sendResult } from '../../../../../core/http/send-result';
import {ResultStatus} from "../../../common/result/resultCode";


export async function loginHandler(req: Request, res: Response) {


    const ip = req.ip || 'unknown';
    const userAgent = req.headers['user-agent'] || 'Unknown device';

    try {
        const { loginOrEmail, password } = req.body ?? {};
        if (!loginOrEmail || !password) {
            res.status(400).send({ message: 'loginOrEmail and password are required' });
            return;
        }

        const result = await authService.loginUser(loginOrEmail, password, ip, userAgent);


        if (result.status === ResultStatus.Success) {
            const { accessToken, refreshToken } = (result as any).data;
            // why: refreshToken только в httpOnly cookie
            res.cookie('refreshToken', refreshToken, refreshCookieOptions);
            // why: в body возвращаем только accessToken (соответствует тесту/Swagger)
            res.status(200).send({ accessToken });
            return;
        }


        sendResult(res, result);
    } catch (e) {
        errorsHandler(e, res);
    }
}

