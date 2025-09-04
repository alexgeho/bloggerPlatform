import { v4 as uuid } from 'uuid';
import {deviceSessionsRepository} from '../repositories/device-sessions.repository';
import { DeviceSession } from '../domain/device-session.entity';
import {response} from "express";
import {jwtService} from "../adapters/jwt.service";
import {ResultStatus} from "../common/result/resultCode";
import {UnauthorizedError} from "../../../core/errors/UnauthorizedError";

function isoFromIat(iat: number) {
    return new Date(iat * 1000).toISOString();
}


export const devicesService = {

    async isDeviceBelongsToUser(userId: string, deviceId: string): Promise<string | null> {

        const devices = await deviceSessionsRepository.getAllDevices(userId);

        if (!devices || devices.length === 0) {
            return null;
        }
        const match = devices.find(d => d.deviceId === deviceId);

        return match ? match.deviceId : null;
    },




    async deleteDevice(userId: string, deviceId: string): Promise<'ok' | 'not_found' | 'forbidden'> {

        const device = await deviceSessionsRepository.findUserByDeviceId(deviceId);

        if (!device) return 'not_found';
        if (device.userId !== userId) return 'forbidden';

        await deviceSessionsRepository.deleteDeviceById(deviceId);
        return 'ok';
    }
,

    async createOnLogin(userId: string, ip: string, userAgent: string): Promise<string> {
        const lastActiveDate = new Date().toISOString();
        const expireAt: Date = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7); // +7 дней


        const session = {
            deviceId: uuid(),
            userId,
            ip,
            userAgent,
            lastActiveDate,
            expireAt
        };

     await deviceSessionsRepository.createOne(session);
        return session.deviceId;
    },

    async updateLastActiveDate(deviceId: string, expireAt: Date) {

        const lastActiveDate = new Date().toISOString();
      await deviceSessionsRepository.updateLastActiveDate (deviceId, lastActiveDate, expireAt);

    },

    async findSessionByDeviceId(deviceId: string): Promise<DeviceSession | null> {

        const session = deviceSessionsRepository.findUserByDeviceId (deviceId);
        return session;

    },

    async getAllDevices(userId: string): Promise<any[]> {
            const sessions = await deviceSessionsRepository.getAllDevices(userId);

            return sessions.map(s => ({

                ip: s.ip,
                title: s.userAgent,
                lastActiveDate: s.lastActiveDate,
                deviceId: s.deviceId,

            }));},

    async deleteAllDevicesExceptCurrent (userId: string, deviceId: string): Promise<void> {

await deviceSessionsRepository.deleteAllDevicesExceptCurrent (userId, deviceId);

    }








        // async updateOnRefresh(userId: string, deviceId: string, iat: number, exp: number) {
    //     await this.repo.updateLastActive(userId, deviceId, isoFromIat(iat), exp);
    // },
    //
    // async list(userId: string) {
    //     return this.repo.listByUser(userId);
    // },



    // async deleteOthers(userId: string, keepDeviceId: string) {
    //     return this.repo.deleteAllExcept(userId, keepDeviceId);
    // }
};
