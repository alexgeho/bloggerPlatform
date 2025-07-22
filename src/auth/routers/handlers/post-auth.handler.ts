import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/types/http-statuses';
import { errorsHandler } from '../../../core/errors/errors.handler';
import {authService} from "../../application/auth.service";

export async function postAuthHandler(req: Request, res: Response) {
    try {

        const { loginOrEmail, password } = req.body;

        const result = await authService.checkCredentials(loginOrEmail, password);

        if (result === true) {
            return res.sendStatus(204);
        } else {
            // result — это объект с errorsMessages
            return res.status(401).json(result);
        }
    }catch (e) {
        errorsHandler(e, res);
    }
}

