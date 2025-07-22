"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postForBlogBodyValidationResultMiddleware = void 0;
var express_validator_1 = require("express-validator");
var postForBlogBodyValidationResultMiddleware = function (req, res, next) {
    // Получаем массив ошибок
    var errors = (0, express_validator_1.validationResult)(req).array({ onlyFirstError: true });
    // Оставляем только нужные поля
    var allowedFields = ['title', 'shortDescription'];
    var filteredErrors = errors
        .map(function (e) { return ({
        message: e.msg,
        field: e.param, // теперь точно!
    }); })
        .filter(function (e) { return allowedFields.includes(e.field); });
    if (filteredErrors.length > 0) {
        res.status(400).json({ errorsMessages: filteredErrors });
        return;
    }
    next();
};
exports.postForBlogBodyValidationResultMiddleware = postForBlogBodyValidationResultMiddleware;
//# sourceMappingURL=post-for-blog-body-validation.middleware.js.map