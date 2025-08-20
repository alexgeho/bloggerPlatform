import {deviceSessionsCollection} from "../../../db/mongo.db"
import {ObjectId, WithId} from 'mongodb';



export const deviceSessionsRepository = {

    async deleteDeviceById (userId: string, deviceId: string) {

        await deviceSessionsCollection.deleteOne({userId, deviceId})
    }
}

