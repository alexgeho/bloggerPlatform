import { v4 as uuid } from 'uuid';
import {deviceSessionsRepository} from '../repositories/device-sessions.repository';
import { DeviceSession } from '../domain/device-session.entity';
import {response} from "express";

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

        const session: DeviceSession = {
            userId,
            ip,
            userAgent,
            lastActiveDate
        };

        const deviceId: string = await deviceSessionsRepository.createOne(session);
        return deviceId;
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
