"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inputValidationResultMiddleware = exports.createErrorMessages = void 0;
const express_validator_1 = require("express-validator");
const http_statuses_1 = require("../../types/http-statuses");
const createErrorMessages = (errors) => {
    return { errorsMessages: errors };
};
exports.createErrorMessages = createErrorMessages;
const formatErrors = (error) => {
    const expressError = error;
    return {
        message: expressError.msg,
        field: expressError.path,
    };
};
const inputValidationResultMiddleware = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req).formatWith(formatErrors).array({ onlyFirstError: true });
    if (errors.length > 0) {
        res.status(http_statuses_1.HttpStatus.BadRequest).json({ errorsMessages: errors });
        return;
    }
    next();
};
exports.inputValidationResultMiddleware = inputValidationResultMiddleware;
