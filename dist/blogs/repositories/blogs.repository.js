"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogsRepository = void 0;
const in_memory_db_1 = require("../../db/in-memory.db");
exports.blogsRepository = {
    findAll() { return in_memory_db_1.db.blogs; },
    findById(id) {
        var _a;
        return (_a = in_memory_db_1.db.blogs.find((d) => d.id === id)) !== null && _a !== void 0 ? _a : null;
    },
    create(newBlog) {
        in_memory_db_1.db.blogs.push(newBlog);
        return newBlog;
    },
    update(id, dto) {
        const blog = in_memory_db_1.db.blogs.find((d) => d.id === id);
        if (!blog) {
            throw new Error('Blog not exist bitau');
        }
        blog.name = dto.name;
        blog.description = dto.description;
        blog.websiteUrl = dto.websiteUrl;
        return;
    }
};
