import {Request, Response} from 'express';
import {verifyRefreshTokenWithDevice} from "../../../adapters/jwt.service";
import {devicesService} from "../../../application/devicesService";


export async function deleteDeviceByIdHandler(req: any, res: any) {

    const token = req.cookies?.refreshToken;
    if (!token) return res.sendStatus(401);

    const verifyToken = await verifyRefreshTokenWithDevice(token);
    if (!verifyToken) return res.sendStatus(401);

    const userId = verifyToken.userId;
    const deviceId = req.params.deviceId;

    const isOwned = await devicesService.isDeviceBelongsToUser(deviceId, userId);
    if (!isOwned) return res.sendStatus(403);

    await devicesService.deleteDeviceById(userId, deviceId);
    return res.sendStatus(204);
}


