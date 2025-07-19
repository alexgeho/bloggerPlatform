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
const posts_service_1 = require("../../application/posts.service");
const errors_handler_1 = require("../../../core/errors/errors.handler");
const map_to_post_input_dto_util_1 = require("../mappers/map-to-post-input-dto.util"); // путь поправь!
function putPostHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const id = req.params.id;
            const dto = (0, map_to_post_input_dto_util_1.mapToPostInputDto)(req.body); // <--- добавь преобразование
            yield posts_service_1.postsService.update(id, dto);
            res.sendStatus(http_statuses_1.HttpStatus.NoContent);
        }
        catch (e) {
            (0, errors_handler_1.errorsHandler)(e, res);
        }
        console.log('PUT HANDLER', req.params.id, req.body);
    });
}
