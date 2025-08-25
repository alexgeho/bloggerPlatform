import {Request, Response} from 'express';
import {devicesService} from "../../../application/devicesService";


export async function deleteDeviceByIdHandler(req: any, res: any) {
    const userId = req.user.userId;
    const deviceId = req.params.deviceId;

    const isOwned = await devicesService.isDeviceBelongsToUser(userId, deviceId);
    if (!isOwned) return res.sendStatus(403);

    await devicesService.deleteDeviceById(userId, deviceId);
    return res.sendStatus(204);
}



