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
        // достаем все устройства этого юзера
        const devices = await deviceSessionsRepository.findByUserAndDevice(userId, deviceId);

        if (!devices) {
            return null; // такого девайса у юзера нет
        }

        return devices.deviceId; // всё ок, вернули deviceId
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

    async updateLastActiveDate(deviceId: string, expireAt: Date) {

        const lastActiveDate = new Date().toISOString();
      await deviceSessionsRepository.updateLastActiveDate (deviceId, lastActiveDate, expireAt);

    },

    async findSessionByDeviceId(deviceId: string): Promise<DeviceSession | null> {

        const session = deviceSessionsRepository.findUserByDeviceId (deviceId);
        return session;

    },

    async getAllDevices(
        userId: string,
        userAgent: string,
        token: string
    ): Promise<DeviceSession[]> {

        const payload = await jwtService.verifyRefreshToken(token);
        if (!payload) {
            throw new UnauthorizedError('Invalid refresh token');
        }

        const session = await deviceSessionsRepository.findUserByDeviceId(payload.deviceId);
        if (!session) {
            throw new UnauthorizedError('Session not found for device ID');
        }

        if (!payload.userAgent) {
            throw new UnauthorizedError('User-Agent missing in refresh token payload');
        }

        // Logging for debug
        console.log('Payload UA:', payload.userAgent);
        console.log('Session UA:', session.userAgent);
        console.log('Request UA:', userAgent);

        const normalizedPayloadUA = payload.userAgent.toLowerCase();
        const normalizedSessionUA = session.userAgent.toLowerCase();
        const normalizedRequestUA = userAgent.toLowerCase();

        if (
            normalizedPayloadUA !== normalizedRequestUA ||
            normalizedSessionUA !== normalizedRequestUA ||
            normalizedSessionUA !== normalizedPayloadUA
        ) {
            throw new UnauthorizedError('User-Agent mismatch detected');
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
