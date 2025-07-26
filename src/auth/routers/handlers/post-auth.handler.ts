import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/types/http-statuses';
import { errorsHandler } from '../../../core/errors/errors.handler';
import {authService} from "../../application/auth.service";
import {RequestWithBody} from "../../common/types/requests";
import {LoginDto} from "../../types/login.dto";
import {ResultStatus} from "../../common/result/resultCode";
import {resultCodeToHttpException} from "../../common/result/resultCodeToHttpException";

export async function postAuthHandler(req: RequestWithBody<LoginDto>, res: Response) {
    try {

        const { loginOrEmail, password } = req.body;

        const result = await authService.checkCredentials(loginOrEmail, password);

        if (result.status !== ResultStatus.Success) {
            return res.status(resultCodeToHttpException(result.status)).send(result.extensions);

        } else {
            // result — это объект с errorsMessages
             res.status(401).json(result);
             return
        }
    }catch (e) {
        errorsHandler(e, res);
    }
}

