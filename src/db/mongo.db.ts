import { Collection, Db, OptionalId, WithId, MongoClient, ObjectId } from "mongodb";
import {Blog} from "../features/blogs/domain/blog";
import {PostDb} from "../features/posts/domain/postDb";
import { SETTINGS } from "../core/settings/settings";
import {User} from "../features/users/domain/user";
import {Auth} from "../features/auth/domain/auth";
import {CommentDb} from "../features/comments/domain/commentDb";

const BLOG_COLLECTION_NAME = "blogs";
const POST_COLLECTION_NAME = "posts";
const USER_COLLECTION_NAME = "users";
const AUTH_COLLECTION_NAME = "auth";
const COMMENT_COLLECTION_NAME = "comments";

export let client: MongoClient;

export let blogCollection: Collection <Blog>;
export let postCollection: Collection<OptionalId<PostDb>>;
export let userCollection: Collection<User>;
export let authCollection: Collection<Auth>;
export let commentCollection: Collection<CommentDb>;

// connecting to db

export async function runDB(url: string): Promise<void> {
    client = new MongoClient(url);
    const db: Db = client.db(SETTINGS.DB_NAME);

    // initialization of collections
    blogCollection = db.collection <Blog>(BLOG_COLLECTION_NAME);
    postCollection = db.collection<OptionalId<PostDb>>(POST_COLLECTION_NAME);
    userCollection = db.collection<User>(USER_COLLECTION_NAME);
    authCollection = db.collection<Auth>(AUTH_COLLECTION_NAME);
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