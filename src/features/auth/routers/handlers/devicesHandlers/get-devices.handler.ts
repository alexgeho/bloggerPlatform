import {Request, Response} from 'express';
import {devicesService} from "../../../application/devicesService";


export async function getDevicesHandler(req: any, res: any) {



    const userId = req.user.userId;
  //  if (!userId) return res.sendStatus(401);



    const sessions = await devicesService.getAllDevices(userId);

    res.status(200).json(sessions);


}