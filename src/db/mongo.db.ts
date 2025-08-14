import { Collection, Db, OptionalId, WithId, MongoClient, ObjectId } from "mongodb";
import {Blog} from "../features/blogs/domain/blog";
import {PostDb} from "../features/posts/domain/postDb";
import { SETTINGS } from "../core/settings/settings";
import {User} from "../features/auth/domain/user";
import {CommentDb} from "../features/comments/domain/commentDb";
import {BlackList} from "../features/auth/domain/blacklist";

const BLOG_COLLECTION_NAME = "blogs";
const POST_COLLECTION_NAME = "posts";
const USER_COLLECTION_NAME = "users";
const BLACKLIST_COLLECTION_NAME = "blackList";
const COMMENT_COLLECTION_NAME = "comments";

export let client: MongoClient;

export let blogCollection: Collection <Blog>;
export let postCollection: Collection<OptionalId<PostDb>>;
export let userCollection: Collection<User>;
export let blacklistCollection: Collection<BlackList>;
export let commentCollection: Collection<CommentDb>;

// connecting to db

export async function runDB(url: string): Promise<void> {
    client = new MongoClient(url);
    const db: Db = client.db(SETTINGS.DB_NAME);

    // initialization of collections
    blogCollection = db.collection <Blog>(BLOG_COLLECTION_NAME);
    postCollection = db.collection<OptionalId<PostDb>>(POST_COLLECTION_NAME);
    userCollection = db.collection<User>(USER_COLLECTION_NAME);
    blacklistCollection = db.collection<BlackList>(BLACKLIST_COLLECTION_NAME);
    commentCollection = db.collection<CommentDb>(COMMENT_COLLECTION_NAME);


    try {
        await client.connect();
        await db.command({ping:1});
    } catch (e) {
await client.close();
throw new Error(`Database NOT Connected: ${e}`);
    }
}

// for tests

export async function stopDb () {
    if (!client) {
        throw new Error("No active client");
    }
    await client.close();
}

// в src/db/mongo.db.ts

export async function dropDb(): Promise<void> {
    if (!client) {
        throw new Error("No active client");
    }
    const db = client.db(SETTINGS.DB_NAME);
    const collections = await db.collections();
    await Promise.all(collections.map((c) => c.deleteMany({})));
}
