import {Request, Response} from 'express';
import {errorsHandler} from '../../../core/errors/errors.handler';
import {authService} from "../../application/auth.service";
import {RequestWithBody} from "../../common/types/requests";
import {LoginDto} from "../../types/login.dto";
import {ResultStatus} from "../../common/result/resultCode";
import {resultCodeToHttpException} from "../../common/result/resultCodeToHttpException";

export async function postAuthHandler(
    req: Request,
    res: Response) {
    const newReq = req as RequestWithBody<LoginDto>;
    try {

        const {loginOrEmail, password} = newReq.body;
        const result
            = await authService.loginUser(loginOrEmail, password);
        if (result.status !== ResultStatus.Success) {
             res
                .status(resultCodeToHttpException(result.status))
                .send(result.extensions);
             return
        }
         res.status(200).send(result.data);
        return

    } catch (e) {
        errorsHandler(e, res);
    }
}

