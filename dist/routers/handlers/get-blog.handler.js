"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBlogHandler = getBlogHandler;
const http_statuses_1 = require("../../core/types/http-statuses");
const error_utils_1 = require("../../core/utils/error.utils");
const blogs_repository_1 = require("../../blogs/repositories/blogs.repository");
function getBlogHandler(req, res) {
    //  const blog = db.blogs.find(b => b.id === +req.params.id);
    const id = parseInt(req.params.id);
    const blog = blogs_repository_1.blogsRepository.findById(id);
    if (!blog) {
        res
            .status(http_statuses_1.HttpStatus.NotFound)
            .send((0, error_utils_1.createErrorMessages)([{ field: 'id', message: 'Blog not found bitau' }]));
        return;
    }
    res.status(200).send(Object.assign(Object.assign({}, blog), { id: String(blog.id) }));
}
