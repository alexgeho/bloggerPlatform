"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inputValidationResultMiddleware = exports.createErrorMessages = void 0;
var express_validator_1 = require("express-validator");
var http_statuses_1 = require("../../types/http-statuses");
var createErrorMessages = function (errors) {
    return { errorsMessages: errors };
};
exports.createErrorMessages = createErrorMessages;
var formatErrors = function (error) {
    var expressError = error;
    return {
        message: expressError.msg,
        field: expressError.path,
    };
};
var inputValidationResultMiddleware = function (req, res, next) {
    var errors = (0, express_validator_1.validationResult)(req).formatWith(formatErrors).array({ onlyFirstError: true });
    console.log(errors);
    if (errors.length > 0) {
        res.status(http_statuses_1.HttpStatus.BadRequest).json({ errorsMessages: errors });
        return;
    }
    next();
};
exports.inputValidationResultMiddleware = inputValidationResultMiddleware;
//# sourceMappingURL=input-validtion-result.middleware.js.map