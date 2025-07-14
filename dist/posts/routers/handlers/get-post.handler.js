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
const map_to_post_output_util_1 = require("../mappers/map-to-post-output.util");
const posts_service_1 = require("../../application/posts.service");
const errors_handler_1 = require("../../../core/errors/errors.handler");
function getPostHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('=== TEST GET POST HANDLER===');
        try {
            const id = req.params.id;
            const post = yield posts_service_1.postsService.findByIdOrFail(id);
            const postOutput = (0, map_to_post_output_util_1.mapToPostOutput)(post);
            res.status(http_statuses_1.HttpStatus.Ok).send(postOutput);
        }
        catch (e) {
            (0, errors_handler_1.errorsHandler)(e, res);
        }
    });
}
