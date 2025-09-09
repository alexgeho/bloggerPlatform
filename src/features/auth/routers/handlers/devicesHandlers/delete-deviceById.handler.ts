import {Request, Response} from 'express';
import {devicesService} from "../../../application/devicesService";


export async function deleteDeviceByIdHandler(req: any, res: any) {

    const userId = req.user?.userId;
    const deviceId = req.params.id;

    if (!userId) return res.sendStatus(401);
    if (!deviceId) return res.sendStatus(404);

    const result = await devicesService.deleteDevice(userId, deviceId);

    if (result === 'not_found') return res.sendStatus(404);
    if (result === 'forbidden') return res.sendStatus(403);

    return res.sendStatus(204);
}




