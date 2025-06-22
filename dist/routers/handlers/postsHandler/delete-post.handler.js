"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePostHandler = deletePostHandler;
const http_statuses_1 = require("../../../core/types/http-statuses");
const error_utils_1 = require("../../../core/utils/error.utils");
const posts_repository_1 = require("../../../posts/repositories/posts.repository");
function deletePostHandler(req, res) {
    const id = parseInt(req.params.id);
    const post = posts_repository_1.postsRepository.findById(id);
    if (!post) {
        res
            .status(http_statuses_1.HttpStatus.NotFound)
            .send((0, error_utils_1.createErrorMessages)([{ field: 'id', message: 'post not found' }]));
        return;
    }
    posts_repository_1.postsRepository.delete(id);
    res.sendStatus(http_statuses_1.HttpStatus.NoContent);
}
