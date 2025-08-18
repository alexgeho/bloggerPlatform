import { Router, Request, Response } from 'express';
import { DevicesService } from '../application/devices.service';
import { refreshTokenGuard } from './guards/refresh-token.guard';

export const securityDevicesRouter: Router = Router();

export const buildSecurityDevicesRouter = (service: DevicesService): Router => {
    const router = Router(); // ✅ создаём локально

    router.get(
        '/',
        refreshTokenGuard,
        async (req: Request, res: Response) => {
            const rows = await service.list(req.refresh!.userId);
            res.status(200).json(
                rows.map(({ deviceId, ip, title, lastActiveDate }) => ({
                    deviceId, ip, title, lastActiveDate
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

    router.delete(
        '/:deviceId',
        refreshTokenGuard,
        async (req: Request, res: Response) => {
            const all = await service.list(req.refresh!.userId);
            const own = all.some(d => d.deviceId === req.params.deviceId);
            if (!own) {
                res.sendStatus(404);
                return;
            }

            await service.deleteCurrent(req.refresh!.userId, req.params.deviceId);
            res.sendStatus(204);
        }
    );

    return router; // ✅ возвращаем свежий экземпляр
};

