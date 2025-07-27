import { Request, Response } from 'express';
import { HttpStatus } from '../../../../core/types/http-statuses';
import { errorsHandler } from '../../../../core/errors/errors.handler';
import { userService } from '../../application/user.service';

export async function deleteUserHandler(
    req: Request<{ id: string }>,
    res: Response,
) {
    try {
        const id = req.params.id;

        await userService.delete(id);

        res.sendStatus(HttpStatus.NoContent);
    } catch (e: unknown) {
        errorsHandler(e, res);
    }
}
