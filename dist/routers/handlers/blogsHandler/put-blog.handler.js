"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateBlogHandler = updateBlogHandler;
const http_statuses_1 = require("../../../core/types/http-statuses");
const error_utils_1 = require("../../../core/utils/error.utils");
const blogInputDtoValidation_1 = require("../../../blogs/validation/blogInputDtoValidation");
const blogs_repository_1 = require("../../../blogs/repositories/blogs.repository");
function updateBlogHandler(req, res) {
    const id = parseInt(req.params.id);
    const errors = (0, blogInputDtoValidation_1.blogInputDtoValidation)(req.body);
    if (errors.length > 0) {
        res.status(http_statuses_1.HttpStatus.BadRequest).send((0, error_utils_1.createErrorMessages)(errors));
        return;
    }
    const blog = blogs_repository_1.blogsRepository.findById(id);
    if (!blog) {
        res
            .status(http_statuses_1.HttpStatus.NotFound)
            .send((0, error_utils_1.createErrorMessages)([{ field: 'id', message: 'Vehicle not found' }]));
        return;
    }
    blogs_repository_1.blogsRepository.update(id, req.body);
    res.sendStatus(http_statuses_1.HttpStatus.Created);
}
