import { Collection } from 'mongodb';
import { DeviceSession } from '../domain/device-session.entity';

export interface DeviceSessionsRepository {
    create(s: DeviceSession): Promise<void>;
    findByUserAndDevice(userId: string, deviceId: string): Promise<DeviceSession | null>;
    listByUser(userId: string): Promise<DeviceSession[]>;
    updateLastActive(userId: string, deviceId: string, iso: string, exp: number): Promise<void>;
    deleteByUserAndDevice(userId: string, deviceId: string): Promise<boolean>;
    deleteAllExcept(userId: string, keepDeviceId: string): Promise<number>;
}

export class MongoDeviceSessionsRepository implements DeviceSessionsRepository {
    constructor(private readonly col: Collection<DeviceSession>) {}
    async create(s: DeviceSession): Promise<void> {
        await this.col.updateOne({ userId: s.userId, deviceId: s.deviceId }, { $set: s }, { upsert: true });
    }
    async findByUserAndDevice(userId: string, deviceId: string) { return this.col.findOne({ userId, deviceId }, { projection: { _id: 0 } }); }
    async listByUser(userId: string) { return this.col.find({ userId }, { projection: { _id: 0 } }).sort({ lastActiveDate: -1 }).toArray(); }
    async updateLastActive(userId: string, deviceId: string, iso: string, exp: number) { await this.col.updateOne({ userId, deviceId }, { $set: { lastActiveDate: iso, refreshTokenExp: exp } }); }
    async deleteByUserAndDevice(userId: string, deviceId: string) { return (await this.col.deleteOne({ userId, deviceId })).deletedCount === 1; }

    async deleteAllExcept(userId: string, keepDeviceId: string) { return (await this.col.deleteMany({ userId, deviceId: { $ne: keepDeviceId } })).deletedCount ?? 0; }
}