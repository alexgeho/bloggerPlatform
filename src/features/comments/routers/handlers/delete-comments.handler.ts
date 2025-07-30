import { Request, Response } from 'express';
import { HttpStatus } from '../../../../core/types/http-statuses';
import { errorsHandler } from '../../../../core/errors/errors.handler';
import { commentsService } from '../../application/comments.service';
import {commentsQwRepository} from "../../repositories/commentsQwRepository";

export async function deleteCommentsHandler
(req: Request <{id: string}>, res: Response) {

    try{
        const id = req.params.id;

        const comment = await commentsQwRepository.findById(id);

        if (!comment){
            res.sendStatus(404);
            return;
        }


        if (comment.commentatorInfo.userId !== req.user.userId) {
            res.status(403).json({})
        }



        await commentsService.deleteById(id)

        res.sendStatus(HttpStatus.NoContent);

    }
    catch (e: unknown) {
        errorsHandler(e, res);
    }

}
