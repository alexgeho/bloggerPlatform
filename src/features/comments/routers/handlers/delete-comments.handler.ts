import { Request, Response } from 'express';
import { HttpStatus } from '../../../../core/types/http-statuses';
import { errorsHandler } from '../../../../core/errors/errors.handler';
import { commentsService } from '../../application/comments.service';

export async function deleteCommentsHandler
(req: Request <{id: string}>, res: Response) {

    try{
        const id = req.params.id;

        await commentsService.deleteById(id)

        res.sendStatus(HttpStatus.NoContent);

    }
    catch (e: unknown) {
        errorsHandler(e, res);
    }

}
