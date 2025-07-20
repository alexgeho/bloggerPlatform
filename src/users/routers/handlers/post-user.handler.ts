import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/types/http-statuses';
import { errorsHandler } from '../../../core/errors/errors.handler';
import {userService} from "../../application/user.service";

export async function postUserHandler(req: Request, res: Response) {
    try {
        // req.body напрямую!
        const createdUserData = await userService.create(req.body);

        res.status(HttpStatus.Created).send(createdUserData);
    } catch (e) {
        errorsHandler(e, res);
    }
}

