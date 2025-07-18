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
exports.postPostHandler = postPostHandler;
const http_statuses_1 = require("../../../core/types/http-statuses");
const errors_handler_1 = require("../../../core/errors/errors.handler");
const posts_service_1 = require("../../application/posts.service");
function postPostHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('=== TEST POST POST HANDLER===');
        try {
            // req.body напрямую!
            const createdPostData = yield posts_service_1.postsService.create(req.body);
            res.status(http_statuses_1.HttpStatus.Created).send(createdPostData);
        }
        catch (e) {
            (0, errors_handler_1.errorsHandler)(e, res);
        }
    });
}
