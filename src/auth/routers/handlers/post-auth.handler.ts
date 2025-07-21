import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/types/http-statuses';
import { errorsHandler } from '../../../core/errors/errors.handler';
import {authService} from "../../application/auth.service";

export async function postAuthHandler(req: Request, res: Response) {
    try {
        // req.body напрямую!
        const { login, email, password } = req.body;
        const createdAuthData = await authService.createAuth(login, email, password);


        res.status(HttpStatus.Created).send(createdAuthData);
    } catch (e) {
        errorsHandler(e, res);
    }
}

