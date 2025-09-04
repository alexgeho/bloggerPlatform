import {Request, Response} from 'express';
import {devicesService} from "../../../application/devicesService";


export async function deleteDeviceByIdHandler(req: any, res: any) {
    const userId = req.user.userId;
    const deviceId = req.params.deviceId;

    const ownedDeviceId = await devicesService.isDeviceBelongsToUser(userId, deviceId);
    if (!ownedDeviceId) {
        return res.sendStatus(403);
    }

// иначе продолжаем выполнение


    await devicesService.deleteDeviceById(userId, deviceId);
    return res.sendStatus(204);
}



