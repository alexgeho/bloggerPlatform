import { Request, Response } from 'express';
import { usersQwRepository } from '../../../../users/repositories/usersQwRepository';
import { HttpStatuses } from '../../../common/types/httpStatuses';
import { jwtService } from '../../../adapters/jwt.service';

export const getMeHandler = async (
    req: Request,
    res: Response
): Promise<void> => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.sendStatus(HttpStatuses.Unauthorized);
        return;
    }

    const token = authHeader.split(' ')[1];
    const payload = await jwtService.verifyToken(token);

    if (!payload) {
        res.sendStatus(HttpStatuses.Unauthorized);
        return;
    }

    const user = await usersQwRepository.findById(payload.userId);

    if (!user) {
        res.sendStatus(HttpStatuses.Unauthorized);
        return;
    }

    res.status(HttpStatuses.Success).send({
        email: user.accountData.email,
        login: user.accountData.login,
        userId: user._id.toString(), // <- если _id это ObjectId, обязательно привести к string
    });

};
