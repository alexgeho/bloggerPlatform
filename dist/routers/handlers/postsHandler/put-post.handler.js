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
exports.putPostHandler = putPostHandler;
const http_statuses_1 = require("../../../core/types/http-statuses");
const posts_repository_1 = require("../../../posts/repositories/posts.repository");
const input_validtion_result_middleware_1 = require("../../../core/middlewares/validation/input-validtion-result.middleware");
function putPostHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const id = req.params.id;
            const post = posts_repository_1.postsRepository.findById(id);
            if (!post) {
                res
                    .status(http_statuses_1.HttpStatus.NotFound)
                    .send((0, input_validtion_result_middleware_1.createErrorMessages)([{ field: 'id', message: 'Post not found' }]));
                return;
            }
            yield posts_repository_1.postsRepository.update(id, req.body);
            res.sendStatus(http_statuses_1.HttpStatus.NoContent);
        }
        catch (e) {
            res.sendStatus(http_statuses_1.HttpStatus.InternalServerError);
        }
    });
}
