import {Request, Response} from 'express';
import {devicesService} from "../../../application/devicesService";


export async function deleteAllDevicesExceptCurrentHandler(req: any, res: any) {

    const userId = req.user.userId;
    const deviceId = req.user.deviceId;

    console.log("REQ", userId, deviceId )

    await devicesService.deleteAllDevicesExceptCurrent(userId, deviceId);
    return res.sendStatus(204);
}



