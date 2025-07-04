"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postCollection = exports.blogCollection = exports.client = void 0;
exports.runDB = runDB;
exports.stopDb = stopDb;
const mongodb_1 = require("mongodb");
const settings_1 = require("../core/settings/settings");
const BLOG_COLLECTION_NAME = "blogs";
const POST_COLLECTION_NAME = "posts";
// connecting to db
function runDB(url) {
    return __awaiter(this, void 0, void 0, function* () {
        exports.client = new mongodb_1.MongoClient(url);
        const db = exports.client.db(settings_1.SETTINGS.DB_NAME);
        // initialization of collection
        exports.blogCollection = db.collection(BLOG_COLLECTION_NAME);
        exports.postCollection = db.collection(POST_COLLECTION_NAME);
        try {
            yield exports.client.connect();
            yield db.command({ ping: 1 });
            console.log("Database Connected");
        }
        catch (e) {
            yield exports.client.close();
            throw new Error(`Database NOT Connected: ${e}`);
        }
    });
}
// for tests
function stopDb() {
    return __awaiter(this, void 0, void 0, function* () {
        if (!exports.client) {
            throw new Error("No active client");
        }
        yield exports.client.close();
    });
}
