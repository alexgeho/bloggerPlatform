"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postsRepository = void 0;
const in_memory_db_1 = require("../../db/in-memory.db");
exports.postsRepository = {
    findAll() { return in_memory_db_1.db.posts; },
    findById(id) {
        var _a;
        return (_a = in_memory_db_1.db.posts.find((d) => d.id === id)) !== null && _a !== void 0 ? _a : null;
    },
    create(newPost) {
        in_memory_db_1.db.posts.push(newPost);
        return newPost;
    },
    update(id, dto) {
        const post = in_memory_db_1.db.posts.find((d) => d.id === id);
        if (!post) {
            throw new Error('Post not exist bitau');
        }
        post.title = dto.title;
        post.shortDescription = dto.shortDescription;
        post.content = dto.content;
        post.blogId = dto.blogId;
        return;
    },
    delete(id) {
        const index = in_memory_db_1.db.posts.findIndex((v) => v.id === id);
        if (index === -1) {
            throw new Error('post not exist Bitau');
        }
        in_memory_db_1.db.posts.splice(index, 1);
        return;
    },
};
