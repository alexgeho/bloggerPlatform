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
exports.createBlogHandler = createBlogHandler;
const http_statuses_1 = require("../../../core/types/http-statuses");
const blogs_repository_1 = require("../../repositories/blogs.repository");
const map_to_blog_output_util_1 = require("../mappers/map-to-blog-output.util");
function createBlogHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const newBlog = {
                name: req.body.name,
                description: req.body.description,
                websiteUrl: req.body.websiteUrl,
                createdAt: new Date().toISOString(), // ✅ ISO-строка
                isMembership: false
            };
            const createdBlog = yield blogs_repository_1.blogsRepository.create(newBlog);
            const blogViewModel = (0, map_to_blog_output_util_1.mapToBlogViewModel)(createdBlog);
            res.status(http_statuses_1.HttpStatus.Created).send(blogViewModel);
        }
        catch (e) {
            res.sendStatus(http_statuses_1.HttpStatus.InternalServerError);
        }
    });
}
