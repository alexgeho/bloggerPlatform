import {HydratedDocument, model, Model, Schema} from "mongoose";

export type RateLimit = {
    ip: string,
    url: string
    date: number
}

const rateLimitSchema = new Schema ({
    ip: {type: String},
    url: {type: String},
    date: {type: Number}
})

type RateLimitModel = Model<RateLimit>;
export type RateLimitDocument = HydratedDocument<RateLimit>;
export const RateLimitModel: RateLimitModel = model<RateLimit, RateLimitModel>('rateLimits', rateLimitSchema);