import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/types/http-statuses';
import { errorsHandler } from '../../../core/errors/errors.handler';
import {authService} from "../../application/auth.service";
import {RequestWithBody} from "../../common/types/requests";
import {LoginDto} from "../../types/login.dto";

export async function postAuthHandler(req: RequestWithBody<LoginDto>, res: Response) {
    try {

        const { loginOrEmail, password } = req.body;

        const result = await authService.checkCredentials(loginOrEmail, password);

        if (result) {
            res.sendStatus(204);
            return
        } else {
            // result — это объект с errorsMessages
             res.status(401).json(result);
             return
        }
    }catch (e) {
        errorsHandler(e, res);
    }
}

