import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/types/http-statuses';
import { errorsHandler } from '../../../core/errors/errors.handler';
import {userService} from "../../application/user.service";

export async function postUserHandler(req: Request, res: Response) {
    try {
        const createdUserData = await userService.create(req.body);

        if ('errorsMessages' in createdUserData) {
             res.status(400).json(createdUserData);
            return;
        }

         res.status(HttpStatus.Created).send(createdUserData);
        return;


    } catch (e) {
        errorsHandler(e, res);
    }
}


