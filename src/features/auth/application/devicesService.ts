import { v4 as uuid } from 'uuid';
import {deviceSessionsRepository} from '../repositories/device-sessions.repository';
import { DeviceSession } from '../domain/device-session.entity';
import {response} from "express";
import {jwtService} from "../adapters/jwt.service";
import {ResultStatus} from "../common/result/resultCode";

function isoFromIat(iat: number) {
    return new Date(iat * 1000).toISOString();
}


export const devicesService = {

    async isDeviceBelongsToUser(userId: string, deviceId: string): Promise<boolean> {
        const device = await deviceSessionsRepository.findUserByDeviceId(deviceId);
        if (!device) return false;
        return device.userId === userId;
    },

    async deleteDeviceById(userId: string,deviceId: string) {

       await deviceSessionsRepository.deleteDeviceById (userId,deviceId);


    },

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

    async updateLastActiveDate(deviceId: string) {

        const lastActiveDate = new Date().toISOString();
      await deviceSessionsRepository.updateLastActiveDate (deviceId, lastActiveDate);

    },

    async findSessionByDeviceId(deviceId: string): Promise<DeviceSession | null> {

        const session = deviceSessionsRepository.findUserByDeviceId (deviceId);
        return session;

    },

    async getAllDevices(
        userId: string,
        userAgent: string,
        token: string
    ): Promise<DeviceSession[] | null> {
        const payload = await jwtService.verifyRefreshToken(token);
        if (!payload) return null;

        const session = await deviceSessionsRepository.findUserByDeviceId(payload.deviceId);
        if (!session) return null;

        if (
            payload.userAgent !== userAgent ||
            session.userAgent !== userAgent ||
            session.userAgent !== payload.userAgent
        ) {
            return null;
        }

        return await deviceSessionsRepository.getAllDevices(userId);
    }
    ,

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
