import {DeviceSession} from "../domain/device-session.entity";
import {ObjectId, WithId} from "mongodb";
import {DeviceSessionModel} from "../domain/device-session.mangoose";


export const deviceSessionsRepository = {

    async findUserByDeviceId(deviceId: string): Promise<WithId<DeviceSession> | null> {
        return DeviceSessionModel.findOne({ _id: new ObjectId(deviceId) });
    },

    async findByUserAndUserAgent(userId: string, userAgent: string): Promise<DeviceSession | null> {
        return DeviceSessionModel.findOne({userId, userAgent});
    },

    async deleteDeviceById(deviceId: string) {

        await DeviceSessionModel.deleteOne({ _id: new ObjectId(deviceId) })
    },

    async createOneOnLogin(session: Omit<DeviceSession, "deviceId">): Promise<string> {
        const result = await DeviceSessionModel.insertOne(session)
        return result._id.toString();
    },

    async updateOnLogin(userId: string, userAgent: string, ip: string): Promise<string> {

        const existing = await DeviceSessionModel.findOne({ userId, userAgent });

        if (!existing) {
            throw new Error("Session not found");
        }

        const result = await DeviceSessionModel.findOneAndUpdate(
            { userId, userAgent },
            { $set: { ip } },
        );
        return existing._id.toString();
    },

    async getAllDevices(userId: string) {
        return DeviceSessionModel.find({userId});
    },

    async deleteAllDevicesExceptCurrent(userId: string, currentDeviceId: string): Promise<void> {

        await DeviceSessionModel.deleteMany({

            userId,
            _id: {$ne: new ObjectId(currentDeviceId)}

        });

    },

    async updateLastActiveDate(deviceId: string, lastActiveDate: Date, expireAt: Date) {
        await DeviceSessionModel.updateOne({deviceId}, {
            $set: {
                lastActiveDate: lastActiveDate,
                expireAt: expireAt,
            }
        });

    },

    async updateSessionWithData(userId: string, deviceId: string, lastActiveDate: Date, expireAt: Date): Promise<void> {
        await DeviceSessionModel.updateOne(
            {userId, _id: new ObjectId(deviceId)},
            {$set: {lastActiveDate, expireAt}}
        );
    },


}

