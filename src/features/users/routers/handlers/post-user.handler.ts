import { Request, Response } from 'express';
import { HttpStatus } from '../../../../core/types/http-statuses';
import { errorsHandler } from '../../../../core/errors/errors.handler';
import {UserService} from "../../application/user.service";

export class PostUserHandler {

    constructor (private userService: UserService) {}

async execute (req: Request, res: Response): Promise<void> {

    try {
        const createdUserData = await this.userService.create(req.body);

        if ('errorsMessages' in createdUserData) {
            res.status(400).json(createdUserData);
            return;}

        res.status(HttpStatus.Created).send(createdUserData);

        return;

    } catch (e) {
        errorsHandler(e, res);
    }
}
}


