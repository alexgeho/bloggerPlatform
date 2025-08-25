import {deviceSessionsCollection} from "../../../db/mongo.db"
import {ObjectId, WithId} from 'mongodb';
import {DeviceSession} from "../domain/device-session.entity";



export const deviceSessionsRepository = {

    async findUserByDeviceId (deviceId: string) {
        return await deviceSessionsCollection.findOne({deviceId: deviceId});
    },

    async deleteDeviceById (userId: string, deviceId: string) {

        await deviceSessionsCollection.deleteOne({userId, deviceId})
    },

    async createOne(session: DeviceSession): Promise<string> {
        const result = await deviceSessionsCollection.insertOne(session);
        return result.insertedId.toString();
    },

    async getAllDevices (userId: string) {
        return await deviceSessionsCollection.find({userId}).toArray();

    },

    async deleteAllDevicesExceptCurrent(userId: string, currentDeviceId: string): Promise<void> {
        await deviceSessionsCollection.deleteMany({
            userId,
            deviceId: { $ne: currentDeviceId }
        });
    }



}

