import {Request, Response} from 'express';
import {devicesService} from "../../../application/devicesService";


export async function getDevicesHandler(req: any, res: any) {

    const userId = req.user?.userId;
    if (!userId) return res.sendStatus(401);

    const userAgent = req.headers['user-agent'];
    if (!userAgent) return res.sendStatus(401);

    const token = req.cookies['token'];
    if (!token) return res.sendStatus(401);


    const sessions = await devicesService.getAllDevices(userId, userAgent, token);

    res.status(200).json(sessions);


}