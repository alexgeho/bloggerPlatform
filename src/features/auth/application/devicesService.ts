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


    }

    // async createOnLogin(sessionInfo: {
    //     userId: string;
    //     ip: string;
    //     userAgent: string;
    //     iat: number;
    //     exp: number;
    // }): Promise<string> {
    //     const deviceId = uuid();
    //
    //     const session: DeviceSession = {
    //         deviceId,
    //         userId: sessionInfo.userId,
    //         ip: sessionInfo.ip,
    //         userAgent: sessionInfo.userAgent || 'Unknown device',
    //         lastActiveDate: isoFromIat(sessionInfo.iat),
    //         refreshTokenExp: sessionInfo.exp,
    //     };
    //
    //     await this.repo.create(session);
    //     return deviceId;
    // },

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
