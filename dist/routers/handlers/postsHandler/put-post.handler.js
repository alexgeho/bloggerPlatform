"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.putPostHandler = putPostHandler;
const http_statuses_1 = require("../../../core/types/http-statuses");
const error_utils_1 = require("../../../core/utils/error.utils");
const posts_repository_1 = require("../../../posts/repositories/posts.repository");
function putPostHandler(req, res) {
    const id = parseInt(req.params.id);
    const blog = posts_repository_1.postsRepository.findById(id);
    if (!blog) {
        res
            .status(http_statuses_1.HttpStatus.NotFound)
            .send((0, error_utils_1.createErrorMessages)([{ field: 'id', message: 'Post not found' }]));
        return;
    }
    posts_repository_1.postsRepository.update(id, req.body);
    res.sendStatus(http_statuses_1.HttpStatus.Created);
}
