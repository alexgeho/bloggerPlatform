import { v4 as uuid } from 'uuid';
import {deviceSessionsRepository} from '../repositories/device-sessions.repository';
import { DeviceSession } from '../domain/device-session.entity';
import {response} from "express";

function isoFromIat(iat: number) {
    return new Date(iat * 1000).toISOString();
}

export type Sessions = Omit<DeviceSession, "deviceId">;


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

// todo type Omit utils, typeScript utils


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

    async findSessionByDeviceId(deviceId: string): Promise<DeviceSession | null> {

        const session = deviceSessionsRepository.findUserByDeviceId (deviceId);
        return session;

    },

    async getAllDevices (userId: string): Promise<DeviceSession[]> {

        const sessions = await deviceSessionsRepository.getAllDevices (userId);

        return sessions;

    },

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
