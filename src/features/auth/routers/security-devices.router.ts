import { Router, Request, Response } from 'express';
import { DevicesService } from '../application/devices.service';
import { refreshTokenGuard } from './guards/refresh-token.guard';

export function buildSecurityDevicesRouter(service: DevicesService) {
    const r = Router();

    r.get('/security/devices', refreshTokenGuard, async (req: Request, res: Response): Promise<void> => {
        const rows = await service.list(req.refresh!.userId);
        res.status(200).json(rows.map(({ deviceId, ip, title, lastActiveDate }) => ({ deviceId, ip, title, lastActiveDate })));
    });

    r.delete('/security/devices', refreshTokenGuard, async (req: Request, res: Response): Promise<void> => {
        await service.deleteOthers(req.refresh!.userId, req.refresh!.deviceId);
        res.sendStatus(204);
    });

    r.delete('/security/devices/:deviceId', refreshTokenGuard, async (req: Request, res: Response): Promise<void> => {
        const all = await service.list(req.refresh!.userId);
        const own = all.some(d => d.deviceId === req.params.deviceId);
        if (!own) { res.sendStatus(404); return; }
        await service.deleteCurrent(req.refresh!.userId, req.params.deviceId);
        res.sendStatus(204);
    });

    return r;
}
