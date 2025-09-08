import {deviceSessionsCollection} from "../../../db/mongo.db"
import {DeviceSession} from "../domain/device-session.entity";
import {ObjectId} from "mongodb";


export const deviceSessionsRepository = {

    async findUserByDeviceId(deviceId: string): Promise<DeviceSession | null> {
        return await deviceSessionsCollection.findOne({deviceId});
    },

    async findByUserAndUserAgent(userId: string, userAgent: string): Promise<DeviceSession | null> {
        return await deviceSessionsCollection.findOne({userId, userAgent});
    },

    async deleteDeviceById(deviceId: string) {

        await deviceSessionsCollection.deleteOne({deviceId})
    },

    async createOneOnLogin(session: Omit<DeviceSession, "deviceId">): Promise<string> {
        const result = await deviceSessionsCollection.insertOne(session)
        return result.insertedId.toString();
    },

    async updateOnLogin(userId: string, userAgent: string, ip: string): Promise<string> {

        const existing = await deviceSessionsCollection.findOne({ userId, userAgent });

        if (!existing) {
            throw new Error("Session not found");
        }

        const result = await deviceSessionsCollection.findOneAndUpdate(
            { userId, userAgent },
            { $set: { ip } },
        );
        return existing._id.toString();
    },

    async getAllDevices(userId: string) {
        return await deviceSessionsCollection.find({userId}).toArray();

    },

    async deleteAllDevicesExceptCurrent(userId: string, currentDeviceId: string): Promise<void> {
        await deviceSessionsCollection.deleteMany({
            userId,
            deviceId: {$ne: currentDeviceId}
        });
    },

    async updateLastActiveDate(deviceId: string, lastActiveDate: Date, expireAt: Date) {
        await deviceSessionsCollection.updateOne({deviceId}, {
            $set: {
                lastActiveDate: lastActiveDate,
                expireAt: expireAt,
            }
        });

    },

    async updateSessionWithData(userId: string, deviceId: string, lastActiveDate: Date, expireAt: Date): Promise<void> {
        await deviceSessionsCollection.updateOne(
            {userId, _id: new ObjectId(deviceId)},
            {$set: {lastActiveDate, expireAt}}
        );
    },


}

