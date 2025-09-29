import { Collection, Db, OptionalId, MongoClient } from "mongodb";
import { Blog } from "../features/blogs/domain/blog";
import { PostDb } from "../features/posts/domain/postDb";
import { User } from "../features/auth/domain/user";
import { CommentDb } from "../features/comments/domain/commentDb";
import { DeviceSession } from "../features/auth/domain/device-session.entity";
import { ENV } from "../core/config/env";
import mongoose from "mongoose";

// const BLOG_COLLECTION_NAME = "blogs";
// const POST_COLLECTION_NAME = "posts";
// const USER_COLLECTION_NAME = "users";
// const COMMENT_COLLECTION_NAME = "comments";
// const DEVICE_SESSIONS_COLLECTION_NAME = "deviceSessions";
// const RATE_LIMITS_COLLECTION_NAME = "rateLimits";
//
// export let client: MongoClient;
//
// export let blogCollection: Collection<Blog>;
// export let postCollection: Collection<OptionalId<PostDb>>;
// export let userCollection: Collection<User>;
// export let commentCollection: Collection<CommentDb>;
// export let deviceSessionsCollection: Collection<DeviceSession>;
// export let rateLimitCollection: Collection<RateLimitEntity>;

export async function runDB(url: string): Promise<void> {
await mongoose.connect(url, {})
    // client = new MongoClient(url);
    // await client.connect();
    // const db: Db = client.db(ENV.DB_NAME);

    // blogCollection = db.collection<Blog>(BLOG_COLLECTION_NAME);
    // postCollection = db.collection<OptionalId<PostDb>>(POST_COLLECTION_NAME);
    // userCollection = db.collection<User>(USER_COLLECTION_NAME);
    // commentCollection = db.collection<CommentDb>(COMMENT_COLLECTION_NAME);
    // deviceSessionsCollection = db.collection<DeviceSession>(DEVICE_SESSIONS_COLLECTION_NAME);
    // rateLimitCollection = db.collection<RateLimitEntity>(RATE_LIMITS_COLLECTION_NAME);


//     try {
//         await db.command({ ping: 1 });
//     } catch (e) {
//         await client.close();
//         throw new Error(`Database NOT Connected: ${e}`);
//     }
}
//
// export async function stopDb(): Promise<void> {
//     if (!client) throw new Error("No active client");
//     await client.close();
// }
//
// export async function dropDb(): Promise<void> {
//     if (!client) throw new Error("No active client");
//     const db = client.db(ENV.DB_NAME);
//     const collections = await db.collections();
//     await Promise.all(collections.map((c) => c.deleteMany({})));
// }
