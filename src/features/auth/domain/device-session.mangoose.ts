import {ObjectId} from "mongodb";
import {HydratedDocument, model, Model, Schema} from "mongoose";

type DeviceSession = {
    _id?: ObjectId;
    userId: ObjectId | string;
    ip: string;
    userAgent: string;
    lastActiveDate?: null | Date;
    expireAt?: null | Date;
}


const DeviceSessionSchema = new Schema<DeviceSession>({
    userId: {type: Schema.Types.ObjectId},
    ip: {type: String},
    userAgent: {type: String},
    lastActiveDate: {type: Date},
    expireAt: {type: Date},
})

type DeviceSessionModel = Model<DeviceSession>;
export type DeviceSessionDocument = HydratedDocument<DeviceSession>;
export const DeviceSessionModel: DeviceSessionModel = model<DeviceSession, DeviceSessionModel>('deviceSessions', DeviceSessionSchema);

