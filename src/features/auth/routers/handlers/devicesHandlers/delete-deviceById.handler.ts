import {Request, Response} from 'express';
import {verifyRefreshTokenWithDevice} from "../../../adapters/jwt.service";


export async function deleteDeviceByIdHandler (
    req: Request,
    res: Response,
) {

    const token = req.cookies?.refreshToken as string | undefined;

    if (!token) { res.sendStatus(401); return; }

    const verifyToken = await verifyRefreshTokenWithDevice(token);

    if (!verifyToken) { res.sendStatus(401); return; }

    const {userId, deviceId} = verifyToken;

    await deleteDeviceByIdHandler.deleteByIds(userId, deviceId);


}

