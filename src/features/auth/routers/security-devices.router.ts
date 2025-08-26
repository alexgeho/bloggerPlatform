import { Router } from 'express';
import { deleteDeviceByIdHandler } from './handlers/devicesHandlers/delete-deviceById.handler';
import {getDevicesHandler} from "./handlers/devicesHandlers/get-devices.handler";
import {accessTokenGuard} from "./guards/access.token.guard";
import {refreshTokenGuard} from "./guards/refresh.token.guard";
import {deleteAllDevicesExceptCurrentHandler} from "./handlers/devicesHandlers/delete-devices-except-current.handler";

export const devicesRouter = Router();


devicesRouter.get('/',
    refreshTokenGuard,
    getDevicesHandler);

devicesRouter.delete('/:Id',
    refreshTokenGuard,
    deleteDeviceByIdHandler);


devicesRouter.delete('/except-current',
    refreshTokenGuard,
    deleteAllDevicesExceptCurrentHandler
);







// devicesRouter.get(
//     '/',
//     refreshTokenGuard,
//     async (req: Request, res: Response) => {
//         const rows: DeviceSession[] = await service.list(req.refresh!.userId);
//
//         res.status(200).json(
//             rows.map(({deviceId, ip, userAgent, lastActiveDate}) => ({
//                 deviceId, ip, userAgent, lastActiveDate
//             }))
//         );
//     }
// );
//
//
// devicesRouter.delete(
//     '/',
//     refreshTokenGuard,
//     async (req: Request, res: Response) => {
//         await service.deleteOthers(req.refresh!.userId, req.refresh!.deviceId);
//         res.sendStatus(204);
//     }
// );

// const own = all.some(d => d.deviceId === req.params.deviceId);
// if (!own) {
//     res.sendStatus(404);
//     return;
// }
//
// await service.deleteCurrent(req.refresh!.userId, req.params.deviceId);

// return router; //