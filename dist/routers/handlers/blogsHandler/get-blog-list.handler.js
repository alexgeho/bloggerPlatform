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
exports.getBlogListHandler = getBlogListHandler;
const http_statuses_1 = require("../../../core/types/http-statuses");
const blogs_repository_1 = require("../../../blogs/repositories/blogs.repository");
const map_to_blog_view_model_util_1 = require("../../../blogs/mappers/map-to-blog-view-model.util");
function getBlogListHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const blogs = yield blogs_repository_1.blogsRepository.findAll();
            const blogViewModels = blogs.map(map_to_blog_view_model_util_1.mapToBlogViewModel);
            res.send(blogViewModels);
        }
        catch (e) {
            res.sendStatus(http_statuses_1.HttpStatus.InternalServerError);
        }
    });
}
