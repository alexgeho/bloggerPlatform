import {Request, Response} from 'express';
import {devicesService} from "../../../application/devicesService";


export async function deleteDeviceByIdHandler(req: any, res: any) {
    const userId = req.user.userId;
    const reqDeviceId = req.params.id;
    console.log('reqDeviceId:', reqDeviceId);
    console.log('userId:', userId);

    const dbMatchDeviceId = await devicesService.isDeviceBelongsToUser(userId, reqDeviceId);

    if (!dbMatchDeviceId) {
        return res.sendStatus(403);
    }

    await devicesService.deleteDeviceById(userId, reqDeviceId);
    return res.sendStatus(204);
}



