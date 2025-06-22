"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPostListHandler = getPostListHandler;
const posts_repository_1 = require("../../../posts/repositories/posts.repository");
function getPostListHandler(req, res) {
    const posts = posts_repository_1.postsRepository.findAll();
    res.send(posts);
}
