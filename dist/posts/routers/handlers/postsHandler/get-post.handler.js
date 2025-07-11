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
exports.getPostHandler = getPostHandler;
const http_statuses_1 = require("../../../core/types/http-statuses");
const error_utils_1 = require("../../../core/utils/error.utils");
const posts_repository_1 = require("../../../posts/repositories/posts.repository");
const map_to_post_view_model_util_1 = require("../../../posts/mappers/map-to-post-view-model.util");
function getPostHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const id = req.params.id;
            const post = yield posts_repository_1.postsRepository.findById(id);
            if (!post) {
                res
                    .status(http_statuses_1.HttpStatus.NotFound)
                    .send((0, error_utils_1.createErrorMessages)([{ field: 'id', message: 'Post not found' }]));
                return;
            }
            const driverViewModel = (0, map_to_post_view_model_util_1.mapToPostViewModel)(post);
            res.status(http_statuses_1.HttpStatus.Ok).send(driverViewModel);
        }
        catch (e) {
            res.sendStatus(http_statuses_1.HttpStatus.InternalServerError);
        }
    });
}
