import {Request, Response} from 'express';
import {HttpStatus} from '../../../../core/types/http-statuses';
import {errorsHandler} from '../../../../core/errors/errors.handler';
import {UserService} from "../../application/user.service";

export class DeleteUserHandler {

    constructor(private userService: UserService) {
    }

    async execute(req: Request<{ id: string }>, res: Response): Promise<void> {

        try {
            const id = req.params.id;

            await this.userService.delete(id);

            res.sendStatus(HttpStatus.NoContent);
        } catch (e: unknown) {
            errorsHandler(e, res);
        }

    }


}
