import { Router, Request, Response } from 'express';
import { devicesService } from '../application/devicesService';
import { refreshTokenGuard } from './guards/refresh-token.guard';
import {DeviceSession} from "../domain/device-session.entity";

//export const securityDevicesRouter: Router = Router();

export const devicesRouter = Router ();


    router.delete(
        '/:deviceId',
        refreshTokenGuard,
        async (req: Request, res: Response) => {

            const idForDelete = await devicesService.deleteById(req.refresh!.userId);

            res.sendStatus(204);

        }
    );




    router.get(
        '/',
        refreshTokenGuard,
        async (req: Request, res: Response) => {
            const rows: DeviceSession[] = await service.list(req.refresh!.userId);

            res.status(200).json(
                rows.map(({ deviceId, ip, userAgent, lastActiveDate }) => ({
                    deviceId, ip, userAgent, lastActiveDate
                }))
            );
        }
    );

    router.delete(
        '/',
        refreshTokenGuard,

        async (req: Request, res: Response) => {
            await service.deleteOthers(req.refresh!.userId, req.refresh!.deviceId);
            res.sendStatus(204);
        }
    );



};


// const own = all.some(d => d.deviceId === req.params.deviceId);
// if (!own) {
//     res.sendStatus(404);
//     return;
// }
//
// await service.deleteCurrent(req.refresh!.userId, req.params.deviceId);

// return router; // ✅ возвращаем свежий экземпляр
