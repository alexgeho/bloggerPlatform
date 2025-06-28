"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SETTINGS = void 0;
exports.SETTINGS = {
    PORT: process.env.PORT || 5003,
    MONGO_URL: process.env.MONGODB_URL || 'mongodb://localhost/admin',
    DB_NAME: process.env.DB_NAME || 'BloggerPlatform',
};
