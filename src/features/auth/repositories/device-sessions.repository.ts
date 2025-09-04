import {deviceSessionsCollection} from "../../../db/mongo.db"
import {DeviceSession} from "../domain/device-session.entity";



export const deviceSessionsRepository = {

    async findUserByDeviceId(deviceId: string): Promise<DeviceSession | null> {
        return await deviceSessionsCollection.findOne({ deviceId });
    },

    async findByUserAndDevice(userId: string, deviceId: string): Promise<DeviceSession | null> {
        return await deviceSessionsCollection.findOne({ userId, deviceId });
    },

    async deleteDeviceById (deviceId: string) {

        await deviceSessionsCollection.deleteOne({deviceId})
    },

    async createOne(session: DeviceSession) {
        await deviceSessionsCollection.insertOne(session);
    },

    async getAllDevices (userId: string) {
        return await deviceSessionsCollection.find({userId}).toArray();

    },

    async deleteAllDevicesExceptCurrent(userId: string, currentDeviceId: string): Promise<void> {
        await deviceSessionsCollection.deleteMany({
            userId,
            deviceId: { $ne: currentDeviceId }
        });
    },

    async updateLastActiveDate (deviceId: string, lastActiveDate: string, expireAt: Date) {
        await deviceSessionsCollection.updateOne({deviceId}, {$set: {lastActiveDate, expireAt}});

    }



}

