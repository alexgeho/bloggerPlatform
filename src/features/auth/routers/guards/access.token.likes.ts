import { NextFunction, Request, Response } from 'express';
import { jwtService } from '../../adapters/jwt.service';
import {JwtPayloadUser} from '../../../../core/types/jwt-payload-user.type'


export const accessTokenLikes = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    if (!req.headers.authorization) {
        req.user = null;
        return next();
    }

    const [authType, token] = req.headers.authorization.split(' ');


    const payload = await jwtService.verifyToken(token);

    if (!payload) {
        res.sendStatus(401);
        return;
    }

    req.user = {
        userId: payload.userId,
        userLogin: payload.userLogin,
    };

    next();
};
