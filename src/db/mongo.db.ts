import { Collection, Db, OptionalId, WithId, MongoClient, ObjectId } from "mongodb";
import {Blog} from "../blogs/domain/blog";
import {PostDb} from "../posts/domain/postDb";
import { SETTINGS } from "../core/settings/settings";

const BLOG_COLLECTION_NAME = "blogs";
const POST_COLLECTION_NAME = "posts";

export let client: MongoClient;
export let blogCollection: Collection <Blog>;
export let postCollection: Collection<OptionalId<PostDb>>;

// connecting to db

export async function runDB(url: string): Promise<void> {
    client = new MongoClient(url);
    const db: Db = client.db(SETTINGS.DB_NAME);

    // initialization of collection
    blogCollection = db.collection <Blog>(BLOG_COLLECTION_NAME);
    postCollection = db.collection<OptionalId<PostDb>>(POST_COLLECTION_NAME);

    try {
        await client.connect();
        await db.command({ping:1});
        console.log("Database Connected");
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