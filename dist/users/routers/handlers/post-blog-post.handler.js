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
exports.postBlogPostHandler = postBlogPostHandler;
const http_statuses_1 = require("../../../core/types/http-statuses");
const errors_handler_1 = require("../../../core/errors/errors.handler");
const posts_service_1 = require("../../../posts/application/posts.service");
const user_service_1 = require("../../application/user.service");
function postBlogPostHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const blogId = req.params.blogId;
            // Проверяем существование блога
            const blog = yield user_service_1.userService.findByIdOrFail(blogId);
            if (!blog) {
                res.status(http_statuses_1.HttpStatus.NotFound).send({ message: 'Blog not found' });
                return;
            }
            // Объединяем blogId из params и всё из body
            const createdPostData = yield posts_service_1.postsService.create(Object.assign(Object.assign({}, req.body), { blogId }));
            res.status(http_statuses_1.HttpStatus.Created).send(createdPostData);
        }
        catch (e) {
            (0, errors_handler_1.errorsHandler)(e, res);
        }
    });
}
