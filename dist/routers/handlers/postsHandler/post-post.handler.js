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
exports.createPostHandler = createPostHandler;
const http_statuses_1 = require("../../../core/types/http-statuses");
const posts_repository_1 = require("../../../posts/repositories/posts.repository");
const map_to_post_view_model_util_1 = require("../../../posts/mappers/map-to-post-view-model.util");
function createPostHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const newPost = {
                title: req.body.title,
                shortDescription: req.body.shortDescription,
                content: req.body.content,
                blogId: req.body.blogId,
                blogName: "TemporaryBlogName",
                createdAt: new Date().toISOString(),
            };
            const createdPost = yield posts_repository_1.postsRepository.create(newPost);
            const postViewModel = (0, map_to_post_view_model_util_1.mapToPostViewModel)(createdPost);
            res.status(http_statuses_1.HttpStatus.Created).send(postViewModel);
        }
        catch (e) {
            res.sendStatus(http_statuses_1.HttpStatus.InternalServerError);
        }
    });
}
