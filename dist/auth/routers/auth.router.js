"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
var express_1 = require("express");
var post_auth_handler_1 = require("./handlers/post-auth.handler");
var auth_input_dto_validation_middlewares_1 = require("../validation/auth.input-dto.validation-middlewares");
exports.authRouter = (0, express_1.Router)();
exports.authRouter.post("/login", auth_input_dto_validation_middlewares_1.authInputDtoValidation, post_auth_handler_1.postAuthHandler);
//# sourceMappingURL=auth.router.js.map