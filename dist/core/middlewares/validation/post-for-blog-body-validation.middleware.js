"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postForBlogBodyValidationResultMiddleware = void 0;
const express_validator_1 = require("express-validator");
const postForBlogBodyValidationResultMiddleware = (req, res, next) => {
    // Получаем массив ошибок
    const errors = (0, express_validator_1.validationResult)(req).array({ onlyFirstError: true });
    // Оставляем только нужные поля
    const allowedFields = ['title', 'shortDescription'];
    const filteredErrors = errors
        .map((e) => ({
        message: e.msg,
        field: e.param, // теперь точно!
    }))
        .filter(e => allowedFields.includes(e.field));
    if (filteredErrors.length > 0) {
        res.status(400).json({ errorsMessages: filteredErrors });
        return;
    }
    next();
};
exports.postForBlogBodyValidationResultMiddleware = postForBlogBodyValidationResultMiddleware;
