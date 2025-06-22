"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBlogHandler = deleteBlogHandler;
const http_statuses_1 = require("../../../core/types/http-statuses");
const error_utils_1 = require("../../../core/utils/error.utils");
const blogs_repository_1 = require("../../../blogs/repositories/blogs.repository");
function deleteBlogHandler(req, res) {
    const id = parseInt(req.params.id);
    const blog = blogs_repository_1.blogsRepository.findById(id);
    if (!blog) {
        res
            .status(http_statuses_1.HttpStatus.NotFound)
            .send((0, error_utils_1.createErrorMessages)([{ field: 'id', message: 'Blog not found' }]));
        return;
    }
    blogs_repository_1.blogsRepository.delete(id);
    res.sendStatus(http_statuses_1.HttpStatus.NoContent);
}
