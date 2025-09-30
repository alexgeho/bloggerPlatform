import { NextFunction, Request, Response } from 'express';
import { jwtService } from '../../adapters/jwt.service';


//todo типы отдельно
export type JwtPayloadUser = {
    userId: string;
    userLogin: string;
};

//todo  перенести в отдельный файл index.d.ts в корне
declare global {
    namespace Express {
        interface Request {
            user: JwtPayloadUser;
        }
    }
}

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
    console.log('payload', payload, '')
    req.user = {
        userId: payload.userId,
        userLogin: payload.userLogin,
    };

    next();
};
