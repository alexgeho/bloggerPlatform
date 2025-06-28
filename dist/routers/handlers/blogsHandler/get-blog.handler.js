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
exports.getBlogHandler = getBlogHandler;
const blogs_repository_1 = require("../../../blogs/repositories/blogs.repository");
const http_statuses_1 = require("../../../core/types/http-statuses");
const error_utils_1 = require("../../../core/utils/error.utils");
const map_to_blog_view_model_util_1 = require("../../../blogs/mappers/map-to-blog-view-model.util");
function getBlogHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = req.params.id;
        const blog = yield blogs_repository_1.blogsRepository.findById(id);
        if (!blog) {
            res.status(http_statuses_1.HttpStatus.NotFound).send((0, error_utils_1.createErrorMessages)([{ field: 'id', message: 'Blog not found' }]));
            return;
        }
        const blogViewModel = (0, map_to_blog_view_model_util_1.mapToBlogViewModel)(blog);
        res.status(http_statuses_1.HttpStatus.Ok).send(blogViewModel);
    });
}
