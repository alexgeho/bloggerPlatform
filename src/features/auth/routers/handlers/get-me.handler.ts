// get-me.handler.ts
import { Request, Response } from 'express';
import { usersQwRepository } from '../../../users/repositories/usersQwRepository';
import { HttpStatuses } from '../../common/types/httpStatuses';

export const getMeHandler = async (
    req: Request,
    res: Response
): Promise<void> => {
    const userId = (req as any).user?.id;

    if (!userId) {
        res.sendStatus(HttpStatuses.Unauthorized);
        return;
    }

    const me = await usersQwRepository.findById(userId);

    res.status(HttpStatuses.Success).send(me);
};
