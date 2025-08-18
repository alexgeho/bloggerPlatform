import { v4 as uuid } from 'uuid';
import { DeviceSessionsRepository } from '../repositories/device-sessions.repository';
import { DeviceSession } from '../domain/device-session.entity';

export class DevicesService {

    constructor(private readonly repo: DeviceSessionsRepository) {}
    private isoFromIat(iat: number) { return new Date(iat * 1000).toISOString(); }

    async createOnLogin(p: { userId: string; ip: string; userAgent: string; iat: number; exp: number; }): Promise<string> {
        const deviceId = uuid();
        const s: DeviceSession = {
            deviceId,
            userId: p.userId,
            ip: p.ip,
            userAgent: p.userAgent || 'Unknown device',
            lastActiveDate: this.isoFromIat(p.iat),
            refreshTokenExp: p.exp,
        };
        await this.repo.create(s); return deviceId;
    }
    async updateOnRefresh(userId: string, deviceId: string, iat: number, exp: number) {
        await this.repo.updateLastActive(userId, deviceId, this.isoFromIat(iat), exp);
    }
    async list(userId: string) { return this.repo.listByUser(userId); }

    async deleteCurrent(userId: string, deviceId: string) { return this.repo.deleteByUserAndDevice(userId, deviceId); }

    async deleteOthers(userId: string, keepDeviceId: string) { return this.repo.deleteAllExcept(userId, keepDeviceId); }
}