import { Request, Response } from 'express';
import { HttpStatus } from '../../../../core/types/http-statuses';
import { postsService } from '../../application/posts.service';
import { errorsHandler } from '../../../../core/errors/errors.handler';
import {PostUpdateInput} from "../input/post-update.input";
import { mapToPostInputDto } from '../mappers/map-to-post-input-dto.util'; // путь поправь!


export async function putPostHandler(
    req: Request<{ id: string }, {}, PostUpdateInput>,
    res: Response
): Promise<void> {
    try {
        const id = req.params.id;
        const dto = mapToPostInputDto(req.body); // <--- добавь преобразование
        await postsService.update(id, dto);
        res.sendStatus(HttpStatus.NoContent);
    } catch (e: unknown) {
        errorsHandler(e, res);
    }

}