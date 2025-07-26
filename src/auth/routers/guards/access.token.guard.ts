import { NextFunction, Request, Response } from 'express';
import { jwtService } from '../../adapters/jwt.service';
import { IdType } from '../../common/types/id';

export const accessTokenGuard = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    if (!req.headers.authorization) {
        res.sendStatus(401);
        return;
    }

    const [authType, token] = req.headers.authorization.split(' ');

    if (authType !== 'Bearer' || !token) {
        res.sendStatus(401);
        return;
    }

    const payload = await jwtService.verifyToken(token);

    if (!payload) {
        res.sendStatus(401);
        return;
    }

    req.user = { id: payload.userId } as IdType;
    next();
};
